/**
 * Playbook Seeder
 *
 * Seeds default playbooks into the vault on activation.
 * Idempotent — only seeds playbooks that don't already exist.
 * Never overwrites user-modified playbooks.
 *
 * Also provides conversion utilities between PlaybookDefinition and
 * IntelligenceEntry for vault storage.
 */

import type { IntelligenceEntry } from '../intelligence/types.js';
import type { PlaybookDefinition } from './playbook-types.js';
import { getAllBuiltinPlaybooks } from './playbook-registry.js';
import type { Vault } from '../vault/vault.js';

/**
 * Convert a PlaybookDefinition to a vault IntelligenceEntry.
 *
 * Field mapping:
 *   id -> id              title -> title
 *   'playbook' -> type    category -> domain
 *   'suggestion' -> severity
 *   trigger -> context (prefixed with full definition JSON for reconstruction)
 *   description -> description
 *   tags -> tags
 *   steps -> example
 *   expectedOutcome -> why
 */
export function playbookDefinitionToEntry(def: PlaybookDefinition): IntelligenceEntry {
  // Serialize the full definition as JSON metadata so playbook_match can reconstruct it
  const metadata = JSON.stringify(def);

  return {
    id: def.id,
    type: 'playbook',
    domain: def.category,
    title: def.title,
    severity: 'suggestion',
    description: def.description,
    context: `__PLAYBOOK_DEF__${metadata}__END_DEF__\n${def.trigger}`,
    example: def.steps,
    why: def.expectedOutcome,
    tags: def.tags,
  };
}

/**
 * Extract a PlaybookDefinition from a vault IntelligenceEntry.
 * Returns null if the entry doesn't contain PlaybookDefinition metadata.
 */
export function entryToPlaybookDefinition(entry: IntelligenceEntry): PlaybookDefinition | null {
  if (entry.type !== 'playbook') return null;

  const context = entry.context ?? '';
  const startMarker = '__PLAYBOOK_DEF__';
  const endMarker = '__END_DEF__';

  const startIdx = context.indexOf(startMarker);
  const endIdx = context.indexOf(endMarker);

  if (startIdx < 0 || endIdx < 0) return null;

  try {
    const json = context.slice(startIdx + startMarker.length, endIdx);
    const def = JSON.parse(json) as PlaybookDefinition;
    // Validate it has the essential fields
    if (!def.id || !def.tier || !def.title) return null;
    return def;
  } catch {
    return null;
  }
}

/**
 * Seed default built-in playbooks into the vault.
 * Idempotent — skips playbooks that already exist (never overwrites).
 */
export function seedDefaultPlaybooks(vault: Vault): {
  seeded: number;
  skipped: number;
  errors: number;
  details: Array<{ id: string; action: 'seeded' | 'skipped' | 'error'; reason?: string }>;
} {
  const result = {
    seeded: 0,
    skipped: 0,
    errors: 0,
    details: [] as Array<{ id: string; action: 'seeded' | 'skipped' | 'error'; reason?: string }>,
  };

  const playbooks = getAllBuiltinPlaybooks();

  for (const playbook of playbooks) {
    try {
      // Check if already exists
      const existing = vault.get(playbook.id);
      if (existing) {
        result.skipped++;
        result.details.push({ id: playbook.id, action: 'skipped', reason: 'already exists' });
        continue;
      }

      const entry = playbookDefinitionToEntry(playbook);
      vault.add(entry);
      result.seeded++;
      result.details.push({ id: playbook.id, action: 'seeded' });
    } catch (error) {
      result.errors++;
      result.details.push({
        id: playbook.id,
        action: 'error',
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}
