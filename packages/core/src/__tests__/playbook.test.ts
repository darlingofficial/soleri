import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Vault } from '../vault/vault.js';
import { validatePlaybook, parsePlaybookFromEntry } from '../vault/playbook.js';
import type { Playbook } from '../vault/playbook.js';
import type { IntelligenceEntry } from '../intelligence/types.js';

function makePlaybook(overrides: Partial<Playbook> = {}): Playbook {
  return {
    id: overrides.id ?? 'pb-1',
    title: overrides.title ?? 'Deploy Checklist',
    domain: overrides.domain ?? 'ops',
    description: overrides.description ?? 'Standard deploy procedure.',
    steps: overrides.steps ?? [
      {
        order: 1,
        title: 'Run tests',
        description: 'Execute full test suite',
        validation: 'All tests pass',
      },
      { order: 2, title: 'Build', description: 'Run production build' },
      {
        order: 3,
        title: 'Deploy',
        description: 'Push to production',
        validation: 'Health check passes',
      },
    ],
    tags: overrides.tags ?? ['deploy', 'checklist'],
    createdAt: overrides.createdAt ?? Date.now(),
    updatedAt: overrides.updatedAt ?? Date.now(),
  };
}

function playbookToEntry(pb: Playbook): IntelligenceEntry {
  return {
    id: pb.id,
    type: 'playbook',
    domain: pb.domain,
    title: pb.title,
    severity: 'suggestion',
    description: pb.description,
    context: JSON.stringify({ steps: pb.steps }),
    tags: pb.tags,
  };
}

describe('validatePlaybook', () => {
  it('should pass for a valid playbook', () => {
    const result = validatePlaybook(makePlaybook());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail for empty title', () => {
    const result = validatePlaybook(makePlaybook({ title: '' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Playbook title must not be empty');
  });

  it('should fail for no steps', () => {
    const result = validatePlaybook(makePlaybook({ steps: [] }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Playbook must have at least one step');
  });

  it('should fail for non-sequential step orders', () => {
    const result = validatePlaybook(
      makePlaybook({
        steps: [
          { order: 1, title: 'Step A', description: 'Desc A' },
          { order: 3, title: 'Step B', description: 'Desc B' },
        ],
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('order 3, expected 2'))).toBe(true);
  });
});

describe('parsePlaybookFromEntry', () => {
  it('should parse a valid playbook entry', () => {
    const pb = makePlaybook();
    const entry = playbookToEntry(pb);
    const parsed = parsePlaybookFromEntry(entry);
    expect(parsed).not.toBeNull();
    expect(parsed!.id).toBe(pb.id);
    expect(parsed!.title).toBe(pb.title);
    expect(parsed!.steps).toHaveLength(3);
    expect(parsed!.steps[0].title).toBe('Run tests');
  });

  it('should return null for a non-playbook entry', () => {
    const entry: IntelligenceEntry = {
      id: 'pat-1',
      type: 'pattern',
      domain: 'testing',
      title: 'Some Pattern',
      severity: 'warning',
      description: 'A pattern.',
      tags: [],
    };
    expect(parsePlaybookFromEntry(entry)).toBeNull();
  });

  it('should return null for invalid context JSON', () => {
    const entry: IntelligenceEntry = {
      id: 'pb-bad',
      type: 'playbook',
      domain: 'ops',
      title: 'Bad Playbook',
      severity: 'suggestion',
      description: 'Has bad context.',
      context: 'not valid json',
      tags: [],
    };
    expect(parsePlaybookFromEntry(entry)).toBeNull();
  });

  it('should return null when context has no steps array', () => {
    const entry: IntelligenceEntry = {
      id: 'pb-nosteps',
      type: 'playbook',
      domain: 'ops',
      title: 'No Steps',
      severity: 'suggestion',
      description: 'Missing steps.',
      context: JSON.stringify({ something: 'else' }),
      tags: [],
    };
    expect(parsePlaybookFromEntry(entry)).toBeNull();
  });
});

describe('Vault playbook integration', () => {
  let vault: Vault;

  beforeEach(() => {
    vault = new Vault(':memory:');
  });

  afterEach(() => {
    vault.close();
  });

  it('should insert and retrieve a playbook via vault.list', () => {
    const pb = makePlaybook();
    const entry = playbookToEntry(pb);
    vault.seed([entry]);

    const results = vault.list({ type: 'playbook' });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('pb-1');
    expect(results[0].type).toBe('playbook');
  });

  it('should find a playbook via FTS5 search', () => {
    const pb = makePlaybook({ title: 'Deploy Checklist Procedure' });
    const entry = playbookToEntry(pb);
    vault.seed([entry]);

    const results = vault.search('deploy checklist');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.id).toBe(pb.id);
  });
});
