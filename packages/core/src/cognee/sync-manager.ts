/**
 * CogneeSyncManager — queued, resilient sync between the Vault SQLite DB and Cognee.
 *
 * Maintains a persistent queue (`cognee_sync_queue`) so that ingestions, updates,
 * and deletions survive process restarts. Drain is idempotent and retry-safe.
 * Health-flip detection auto-drains when Cognee comes back online.
 *
 * Ported from Salvador MCP's battle-tested cognee-sync module.
 */

import { createHash } from 'node:crypto';
import type { PersistenceProvider } from '../persistence/types.js';
import type { CogneeClient } from './client.js';
import type { IntelligenceEntry } from '../intelligence/types.js';

// ─── Types ──────────────────────────────────────────────────────────

export type SyncOp = 'ingest' | 'update' | 'delete';
export type SyncStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SyncQueueItem {
  id: number;
  op: SyncOp;
  entryId: string;
  dataset: string;
  contentHash: string | null;
  status: SyncStatus;
  attempts: number;
  error: string | null;
  createdAt: number;
  processedAt: number | null;
}

export interface SyncManagerStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  queueSize: number;
  lastDrainAt: number | null;
}

// ─── Constants ──────────────────────────────────────────────────────

const MAX_BATCH = 10;
const MAX_RETRIES = 3;

// ─── CogneeSyncManager ─────────────────────────────────────────────

export class CogneeSyncManager {
  private db: PersistenceProvider;
  private cognee: CogneeClient;
  private dataset: string;
  private lastDrainAt: number | null = null;
  private drainTimer: ReturnType<typeof setInterval> | null = null;
  private wasAvailable: boolean = false;

  constructor(db: PersistenceProvider, cognee: CogneeClient, dataset: string) {
    this.db = db;
    this.cognee = cognee;
    this.dataset = dataset;
    this.initSchema();
    this.wasAvailable = cognee.isAvailable;
  }

  // ─── Schema ────────────────────────────────────────────────────

  private initSchema(): void {
    this.db.execSql(`
      CREATE TABLE IF NOT EXISTS cognee_sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        op TEXT NOT NULL,
        entry_id TEXT NOT NULL,
        dataset TEXT NOT NULL,
        content_hash TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        attempts INTEGER NOT NULL DEFAULT 0,
        error TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        processed_at INTEGER
      )
    `);

    // Add cognee_ingested_hash column to entries table for reconciliation.
    // ALTER TABLE ... ADD COLUMN is a no-op error when the column already exists.
    try {
      this.db.run('ALTER TABLE entries ADD COLUMN cognee_ingested_hash TEXT');
    } catch {
      // Column already exists — expected on subsequent runs.
    }
  }

  // ─── Content hashing ──────────────────────────────────────────

  /**
   * SHA-256 of the serialized entry fields, truncated to 16 hex characters.
   * Deterministic for identical content — used to detect drift.
   */
  static contentHash(entry: IntelligenceEntry): string {
    const payload = JSON.stringify({
      id: entry.id,
      type: entry.type,
      domain: entry.domain,
      title: entry.title,
      severity: entry.severity,
      description: entry.description,
      context: entry.context ?? null,
      example: entry.example ?? null,
      counterExample: entry.counterExample ?? null,
      why: entry.why ?? null,
      tags: entry.tags,
      appliesTo: entry.appliesTo ?? [],
    });
    return createHash('sha256').update(payload).digest('hex').slice(0, 16);
  }

  // ─── Enqueue ──────────────────────────────────────────────────

  /**
   * Add an operation to the sync queue.
   *
   * @param op       The operation type (ingest | update | delete).
   * @param entryId  The vault entry ID.
   * @param entry    Optional entry for hash computation. If omitted, hash is null.
   */
  enqueue(op: SyncOp, entryId: string, entry?: IntelligenceEntry): void {
    const contentHash = entry ? CogneeSyncManager.contentHash(entry) : null;
    this.db.run(
      `INSERT INTO cognee_sync_queue (op, entry_id, dataset, content_hash)
       VALUES (@op, @entryId, @dataset, @contentHash)`,
      {
        op,
        entryId,
        dataset: this.dataset,
        contentHash,
      },
    );
  }

  // ─── Drain ────────────────────────────────────────────────────

  /**
   * Process up to MAX_BATCH pending items from the queue.
   * Returns the number of items successfully processed.
   *
   * If Cognee is not available, returns 0 without touching the queue.
   */
  async drain(): Promise<number> {
    if (!this.cognee.isAvailable) return 0;

    // Claim a batch: move pending → processing
    const items = this.db.all<Record<string, unknown>>(
      `SELECT * FROM cognee_sync_queue
       WHERE status = 'pending' AND dataset = @dataset
       ORDER BY created_at ASC
       LIMIT @limit`,
      { dataset: this.dataset, limit: MAX_BATCH },
    );

    if (items.length === 0) return 0;

    let processed = 0;

    for (const raw of items) {
      const item = rowToQueueItem(raw);

      // Mark as processing
      this.db.run(
        `UPDATE cognee_sync_queue SET status = 'processing', attempts = attempts + 1 WHERE id = @id`,
        { id: item.id },
      );

      try {
        if (item.op === 'ingest' || item.op === 'update') {
          const entry = this.readEntry(item.entryId);
          if (!entry) {
            // Entry was deleted from vault before we could sync — mark completed
            this.markCompleted(item.id);
            processed++;
            continue;
          }

          const result = await this.cognee.addEntries([entry]);
          if (result.added === 0) {
            throw new Error('Cognee addEntries returned 0 added');
          }

          // Update the ingested hash on the entries table
          const hash = CogneeSyncManager.contentHash(entry);
          this.db.run(`UPDATE entries SET cognee_ingested_hash = @hash WHERE id = @id`, {
            hash,
            id: item.entryId,
          });

          this.markCompleted(item.id);
          processed++;
        } else if (item.op === 'delete') {
          // deleteEntries may not exist yet — graceful degradation
          const client = this.cognee as unknown as Record<string, unknown>;
          if (typeof client.deleteEntries === 'function') {
            await (client.deleteEntries as (ids: string[]) => Promise<unknown>)([item.entryId]);
          }
          // Clear the ingested hash (entry may already be gone from entries table)
          this.db.run(`UPDATE entries SET cognee_ingested_hash = NULL WHERE id = @id`, {
            id: item.entryId,
          });
          this.markCompleted(item.id);
          processed++;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        const attempts = item.attempts + 1; // Already incremented above
        if (attempts >= MAX_RETRIES) {
          this.db.run(
            `UPDATE cognee_sync_queue SET status = 'failed', error = @error, processed_at = unixepoch() WHERE id = @id`,
            { id: item.id, error: errorMsg },
          );
        } else {
          // Back to pending for retry
          this.db.run(
            `UPDATE cognee_sync_queue SET status = 'pending', error = @error WHERE id = @id`,
            { id: item.id, error: errorMsg },
          );
        }
      }
    }

    this.lastDrainAt = Math.floor(Date.now() / 1000);
    return processed;
  }

  // ─── Reconciliation ───────────────────────────────────────────

  /**
   * Find entries whose cognee_ingested_hash is NULL or doesn't match the
   * current content hash. Enqueue dirty entries for re-ingestion.
   *
   * Returns the number of entries enqueued.
   */
  reconcile(): number {
    // Get all entries that either have never been ingested or whose content changed
    const rows = this.db.all<Record<string, unknown>>(
      `SELECT * FROM entries WHERE cognee_ingested_hash IS NULL
       UNION ALL
       SELECT * FROM entries WHERE cognee_ingested_hash IS NOT NULL`,
    );

    let enqueued = 0;

    for (const raw of rows) {
      const entry = this.rowToEntry(raw);
      const currentHash = CogneeSyncManager.contentHash(entry);
      const ingestedHash = raw.cognee_ingested_hash as string | null;

      if (ingestedHash === currentHash) continue;

      // Determine op: null hash means never ingested, mismatched means update
      const op: SyncOp = ingestedHash === null ? 'ingest' : 'update';

      // Avoid duplicate pending items for the same entry
      const existing = this.db.get<{ id: number }>(
        `SELECT id FROM cognee_sync_queue
         WHERE entry_id = @entryId AND dataset = @dataset AND status = 'pending'`,
        { entryId: entry.id, dataset: this.dataset },
      );

      if (!existing) {
        this.enqueue(op, entry.id, entry);
        enqueued++;
      }
    }

    return enqueued;
  }

  // ─── Stats ────────────────────────────────────────────────────

  getStats(): SyncManagerStats {
    const countByStatus = (status: SyncStatus): number => {
      const row = this.db.get<{ count: number }>(
        `SELECT COUNT(*) as count FROM cognee_sync_queue WHERE status = @status AND dataset = @dataset`,
        { status, dataset: this.dataset },
      );
      return row?.count ?? 0;
    };

    const pending = countByStatus('pending');
    const processing = countByStatus('processing');
    const completed = countByStatus('completed');
    const failed = countByStatus('failed');

    return {
      pending,
      processing,
      completed,
      failed,
      queueSize: pending + processing,
      lastDrainAt: this.lastDrainAt,
    };
  }

  // ─── Health-flip detection ────────────────────────────────────

  /**
   * Detects an unavailable-to-available transition on the Cognee client.
   * When Cognee comes back online, automatically triggers a drain.
   *
   * Call this periodically (e.g. after each health check).
   */
  async checkHealthFlip(): Promise<void> {
    const nowAvailable = this.cognee.isAvailable;
    if (nowAvailable && !this.wasAvailable) {
      // Cognee just came back online — drain the queue
      await this.drain();
    }
    this.wasAvailable = nowAvailable;
  }

  // ─── Cleanup ──────────────────────────────────────────────────

  /**
   * Clear any periodic drain timer.
   */
  close(): void {
    if (this.drainTimer) {
      clearInterval(this.drainTimer);
      this.drainTimer = null;
    }
  }

  // ─── Private helpers ──────────────────────────────────────────

  private markCompleted(id: number): void {
    this.db.run(
      `UPDATE cognee_sync_queue SET status = 'completed', processed_at = unixepoch() WHERE id = @id`,
      { id },
    );
  }

  /**
   * Read an entry from the entries table by ID.
   * Returns null if the entry doesn't exist.
   */
  private readEntry(id: string): IntelligenceEntry | null {
    const row = this.db.get<Record<string, unknown>>('SELECT * FROM entries WHERE id = @id', {
      id,
    });
    return row ? this.rowToEntry(row) : null;
  }

  /**
   * Convert a raw DB row into an IntelligenceEntry.
   */
  private rowToEntry(row: Record<string, unknown>): IntelligenceEntry {
    return {
      id: row.id as string,
      type: row.type as IntelligenceEntry['type'],
      domain: row.domain as string,
      title: row.title as string,
      severity: row.severity as IntelligenceEntry['severity'],
      description: row.description as string,
      context: (row.context as string) ?? undefined,
      example: (row.example as string) ?? undefined,
      counterExample: (row.counter_example as string) ?? undefined,
      why: (row.why as string) ?? undefined,
      tags: JSON.parse((row.tags as string) || '[]'),
      appliesTo: JSON.parse((row.applies_to as string) || '[]'),
      validFrom: (row.valid_from as number) ?? undefined,
      validUntil: (row.valid_until as number) ?? undefined,
    };
  }
}

// ─── Module-level helpers ─────────────────────────────────────────

function rowToQueueItem(row: Record<string, unknown>): SyncQueueItem {
  return {
    id: row.id as number,
    op: row.op as SyncOp,
    entryId: row.entry_id as string,
    dataset: row.dataset as string,
    contentHash: (row.content_hash as string) ?? null,
    status: row.status as SyncStatus,
    attempts: row.attempts as number,
    error: (row.error as string) ?? null,
    createdAt: row.created_at as number,
    processedAt: (row.processed_at as number) ?? null,
  };
}
