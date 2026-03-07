/**
 * Cognee sync operations — 3 ops for queue visibility and control.
 */

import { z } from 'zod';
import type { OpDefinition } from '../facades/types.js';
import type { CogneeSyncManager } from '../cognee/sync-manager.js';

/**
 * Create the 3 cognee-sync operations.
 *
 * The sync manager is optional — when null, all ops return a graceful error.
 */
export function createCogneeSyncOps(syncManager: CogneeSyncManager | null): OpDefinition[] {
  return [
    // ─── Status ──────────────────────────────────────────────────
    {
      name: 'cognee_sync_status',
      description:
        'Get current cognee sync queue stats — pending, processing, completed, failed counts.',
      auth: 'read',
      schema: z.object({}),
      handler: async () => {
        if (!syncManager) {
          return { error: 'Sync manager not configured' };
        }
        return syncManager.getStats();
      },
    },

    // ─── Drain ───────────────────────────────────────────────────
    {
      name: 'cognee_sync_drain',
      description:
        'Process pending items in the cognee sync queue. Returns count of processed items and updated stats.',
      auth: 'write',
      schema: z.object({}),
      handler: async () => {
        if (!syncManager) {
          return { error: 'Sync manager not configured' };
        }
        const processed = await syncManager.drain();
        return { processed, stats: syncManager.getStats() };
      },
    },

    // ─── Reconcile ───────────────────────────────────────────────
    {
      name: 'cognee_sync_reconcile',
      description:
        'Find vault entries with stale or missing cognee ingestion and enqueue them for sync.',
      auth: 'write',
      schema: z.object({}),
      handler: async () => {
        if (!syncManager) {
          return { error: 'Sync manager not configured' };
        }
        const enqueued = syncManager.reconcile();
        return { enqueued, stats: syncManager.getStats() };
      },
    },
  ];
}
