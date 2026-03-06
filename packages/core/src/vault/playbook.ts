import type { IntelligenceEntry } from '../intelligence/types.js';

export interface PlaybookStep {
  order: number;
  title: string;
  description: string;
  validation?: string;
}

export interface Playbook {
  id: string;
  title: string;
  domain: string;
  description: string;
  steps: PlaybookStep[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface PlaybookValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a playbook's structure.
 * Checks: title non-empty, steps.length > 0, each step has order/title/description,
 * orders are sequential starting from 1.
 */
export function validatePlaybook(playbook: Playbook): PlaybookValidationResult {
  const errors: string[] = [];

  if (!playbook.title || playbook.title.trim() === '') {
    errors.push('Playbook title must not be empty');
  }

  if (!playbook.steps || playbook.steps.length === 0) {
    errors.push('Playbook must have at least one step');
  } else {
    for (let i = 0; i < playbook.steps.length; i++) {
      const step = playbook.steps[i];
      const expectedOrder = i + 1;

      if (step.order !== expectedOrder) {
        errors.push(`Step ${i + 1} has order ${step.order}, expected ${expectedOrder}`);
      }
      if (!step.title || step.title.trim() === '') {
        errors.push(`Step ${expectedOrder} title must not be empty`);
      }
      if (!step.description || step.description.trim() === '') {
        errors.push(`Step ${expectedOrder} description must not be empty`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Parse a Playbook from a vault IntelligenceEntry.
 * Returns null if the entry is not a playbook type or if the context is not valid
 * JSON with a steps array.
 */
export function parsePlaybookFromEntry(entry: IntelligenceEntry): Playbook | null {
  if (entry.type !== 'playbook') return null;

  let steps: PlaybookStep[];
  try {
    const parsed = JSON.parse(entry.context ?? '');
    if (!Array.isArray(parsed?.steps)) return null;
    steps = parsed.steps;
  } catch {
    return null;
  }

  return {
    id: entry.id,
    title: entry.title,
    domain: entry.domain,
    description: entry.description,
    steps,
    tags: entry.tags,
    createdAt: 0, // not available from entry directly
    updatedAt: 0,
  };
}
