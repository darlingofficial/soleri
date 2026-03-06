/**
 * Playbook Operations — 5 ops for playbook management.
 *
 * Existing ops (moved from core-ops.ts):
 *   playbook_list, playbook_get, playbook_create
 *
 * New ops:
 *   playbook_match  — match playbooks by intent + text
 *   playbook_seed   — seed built-in playbooks into vault
 */

import { z } from 'zod';
import type { OpDefinition } from '../facades/types.js';
import type { AgentRuntime } from './types.js';
import { parsePlaybookFromEntry, validatePlaybook } from '../vault/playbook.js';
import {
  matchPlaybooks,
  seedDefaultPlaybooks,
  entryToPlaybookDefinition,
} from '../playbooks/index.js';
import type { PlaybookIntent } from '../playbooks/index.js';

export function createPlaybookOps(runtime: AgentRuntime): OpDefinition[] {
  const { vault } = runtime;

  return [
    // ─── playbook_list ──────────────────────────────────────────────
    {
      name: 'playbook_list',
      description: 'List playbooks stored in the vault, optionally filtered by domain.',
      auth: 'read',
      schema: z.object({
        domain: z.string().optional(),
        limit: z.number().optional(),
      }),
      handler: async (params) => {
        const entries = vault.list({
          type: 'playbook',
          domain: params.domain as string | undefined,
          limit: (params.limit as number) ?? 50,
        });
        const playbooks = entries.map((e) => parsePlaybookFromEntry(e)).filter((p) => p !== null);
        return { playbooks, count: playbooks.length };
      },
    },

    // ─── playbook_get ───────────────────────────────────────────────
    {
      name: 'playbook_get',
      description: 'Get a single playbook by ID, parsed into structured steps.',
      auth: 'read',
      schema: z.object({ id: z.string() }),
      handler: async (params) => {
        const entry = vault.get(params.id as string);
        if (!entry) return { error: 'Playbook not found: ' + params.id };
        if (entry.type !== 'playbook') return { error: 'Entry is not a playbook: ' + params.id };
        const playbook = parsePlaybookFromEntry(entry);
        if (!playbook) return { error: 'Failed to parse playbook context: ' + params.id };
        return playbook;
      },
    },

    // ─── playbook_create ────────────────────────────────────────────
    {
      name: 'playbook_create',
      description:
        'Create a playbook with structured steps. Validates step ordering and builds vault entry automatically.',
      auth: 'write',
      schema: z.object({
        id: z.string().optional(),
        title: z.string(),
        domain: z.string(),
        description: z.string(),
        steps: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            validation: z.string().optional(),
          }),
        ),
        tags: z.array(z.string()).optional().default([]),
        severity: z.enum(['critical', 'warning', 'suggestion']).optional().default('suggestion'),
      }),
      handler: async (params) => {
        const title = params.title as string;
        const domain = params.domain as string;
        const rawSteps = params.steps as Array<{
          title: string;
          description: string;
          validation?: string;
        }>;

        const steps = rawSteps.map((s, i) => ({ ...s, order: i + 1 }));
        const id =
          (params.id as string | undefined) ??
          `playbook-${domain}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        const playbook = {
          id,
          title,
          domain,
          description: params.description as string,
          steps,
          tags: params.tags as string[],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const validation = validatePlaybook(playbook);
        if (!validation.valid) {
          return { created: false, id, errors: validation.errors };
        }

        vault.add({
          id,
          type: 'playbook',
          domain,
          title,
          severity:
            (params.severity as 'critical' | 'warning' | 'suggestion' | undefined) ?? 'suggestion',
          description: params.description as string,
          context: JSON.stringify({ steps }),
          tags: params.tags as string[],
        });

        return { created: true, id, steps: steps.length };
      },
    },

    // ─── playbook_match (NEW) ───────────────────────────────────────
    {
      name: 'playbook_match',
      description:
        'Match playbooks by intent and text. Combines vault-stored and built-in playbooks, returns best match with merged gates/tasks/tools.',
      auth: 'read',
      schema: z.object({
        intent: z
          .enum(['BUILD', 'FIX', 'REVIEW', 'PLAN', 'IMPROVE', 'DELIVER'])
          .optional()
          .describe('Plan intent for matching'),
        text: z.string().describe('Plan objective + scope text to match against'),
      }),
      handler: async (params) => {
        const intent = params.intent as PlaybookIntent | undefined;
        const text = params.text as string;

        // Load vault playbooks and convert to PlaybookDefinition
        const vaultEntries = vault.list({ type: 'playbook', limit: 200 });
        const vaultPlaybooks = vaultEntries
          .map((e) => entryToPlaybookDefinition(e))
          .filter((p): p is NonNullable<typeof p> => p !== null);

        const result = matchPlaybooks(intent, text, vaultPlaybooks);
        return result;
      },
    },

    // ─── playbook_seed (NEW) ────────────────────────────────────────
    {
      name: 'playbook_seed',
      description:
        'Seed built-in playbooks into the vault. Idempotent — skips existing playbooks. Seeds 6 generic playbooks (TDD, brainstorming, code-review, subagent-execution, debugging, verification).',
      auth: 'write',
      handler: async () => {
        return seedDefaultPlaybooks(vault);
      },
    },
  ];
}
