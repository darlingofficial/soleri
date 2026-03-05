import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createAgentRuntime } from '../runtime/runtime.js';
import { IdentityManager } from '../control/identity-manager.js';
import type { AgentRuntime } from '../runtime/types.js';

describe('IdentityManager', () => {
  let runtime: AgentRuntime;
  let manager: IdentityManager;
  let plannerDir: string;
  const AGENT = 'test-agent';

  beforeEach(() => {
    plannerDir = join(tmpdir(), 'identity-test-' + Date.now());
    mkdirSync(plannerDir, { recursive: true });
    runtime = createAgentRuntime({
      agentId: 'identity-test',
      vaultPath: ':memory:',
      plansPath: join(plannerDir, 'plans.json'),
    });
    manager = new IdentityManager(runtime.vault);
  });

  afterEach(() => {
    runtime.close();
    rmSync(plannerDir, { recursive: true, force: true });
  });

  // ─── Identity CRUD ──────────────────────────────────────────────────

  it('should return null for unknown agent', () => {
    expect(manager.getIdentity('nonexistent')).toBeNull();
  });

  it('should create identity with defaults', () => {
    const identity = manager.setIdentity(AGENT, { name: 'TestBot' });
    expect(identity.agentId).toBe(AGENT);
    expect(identity.name).toBe('TestBot');
    expect(identity.role).toBe('');
    expect(identity.description).toBe('');
    expect(identity.personality).toEqual([]);
    expect(identity.version).toBe(1);
    expect(identity.guidelines).toEqual([]);
  });

  it('should create identity with all fields', () => {
    const identity = manager.setIdentity(AGENT, {
      name: 'TestBot',
      role: 'Test Runner',
      description: 'A test agent',
      personality: ['precise', 'thorough'],
    });
    expect(identity.name).toBe('TestBot');
    expect(identity.role).toBe('Test Runner');
    expect(identity.description).toBe('A test agent');
    expect(identity.personality).toEqual(['precise', 'thorough']);
  });

  it('should use agentId as name if name not provided', () => {
    const identity = manager.setIdentity(AGENT, {});
    expect(identity.name).toBe(AGENT);
  });

  it('should retrieve identity after creation', () => {
    manager.setIdentity(AGENT, { name: 'TestBot', role: 'Runner' });
    const identity = manager.getIdentity(AGENT);
    expect(identity).not.toBeNull();
    expect(identity!.name).toBe('TestBot');
    expect(identity!.role).toBe('Runner');
  });

  it('should update identity with partial fields', () => {
    manager.setIdentity(AGENT, { name: 'V1', role: 'Role1', description: 'Desc1' });
    const updated = manager.setIdentity(AGENT, { role: 'Role2' });
    expect(updated.name).toBe('V1');
    expect(updated.role).toBe('Role2');
    expect(updated.description).toBe('Desc1');
    expect(updated.version).toBe(2);
  });

  it('should increment version on each update', () => {
    manager.setIdentity(AGENT, { name: 'V1' });
    manager.setIdentity(AGENT, { name: 'V2' });
    manager.setIdentity(AGENT, { name: 'V3' });
    const identity = manager.getIdentity(AGENT);
    expect(identity!.version).toBe(3);
  });

  // ─── Guidelines ─────────────────────────────────────────────────────

  it('should add a guideline', () => {
    const guideline = manager.addGuideline(AGENT, {
      category: 'behavior',
      text: 'Always be helpful',
    });
    expect(guideline.id).toBeDefined();
    expect(guideline.category).toBe('behavior');
    expect(guideline.text).toBe('Always be helpful');
    expect(guideline.priority).toBe(0);
  });

  it('should add guideline with priority', () => {
    const guideline = manager.addGuideline(AGENT, {
      category: 'restriction',
      text: 'Never share secrets',
      priority: 10,
    });
    expect(guideline.priority).toBe(10);
  });

  it('should list guidelines by category', () => {
    manager.addGuideline(AGENT, { category: 'behavior', text: 'Be helpful' });
    manager.addGuideline(AGENT, { category: 'restriction', text: 'No secrets' });
    manager.addGuideline(AGENT, { category: 'behavior', text: 'Be concise' });

    const behaviors = manager.getGuidelines(AGENT, 'behavior');
    expect(behaviors).toHaveLength(2);
    expect(behaviors.every((g) => g.category === 'behavior')).toBe(true);

    const restrictions = manager.getGuidelines(AGENT, 'restriction');
    expect(restrictions).toHaveLength(1);
  });

  it('should list all guidelines', () => {
    manager.addGuideline(AGENT, { category: 'behavior', text: 'A' });
    manager.addGuideline(AGENT, { category: 'style', text: 'B' });
    const all = manager.getGuidelines(AGENT);
    expect(all).toHaveLength(2);
  });

  it('should remove a guideline', () => {
    const guideline = manager.addGuideline(AGENT, { category: 'behavior', text: 'Temp' });
    expect(manager.removeGuideline(guideline.id)).toBe(true);
    expect(manager.getGuidelines(AGENT)).toHaveLength(0);
  });

  it('should return false removing nonexistent guideline', () => {
    expect(manager.removeGuideline('nonexistent-id')).toBe(false);
  });

  it('should include guidelines in getIdentity', () => {
    manager.setIdentity(AGENT, { name: 'Bot' });
    manager.addGuideline(AGENT, { category: 'behavior', text: 'Be helpful' });
    manager.addGuideline(AGENT, { category: 'restriction', text: 'No secrets' });

    const identity = manager.getIdentity(AGENT);
    expect(identity!.guidelines).toHaveLength(2);
  });

  it('should order guidelines by priority descending', () => {
    manager.addGuideline(AGENT, { category: 'behavior', text: 'Low', priority: 1 });
    manager.addGuideline(AGENT, { category: 'behavior', text: 'High', priority: 10 });
    manager.addGuideline(AGENT, { category: 'behavior', text: 'Mid', priority: 5 });

    const guidelines = manager.getGuidelines(AGENT, 'behavior');
    expect(guidelines[0].text).toBe('High');
    expect(guidelines[1].text).toBe('Mid');
    expect(guidelines[2].text).toBe('Low');
  });

  // ─── Versioning ─────────────────────────────────────────────────────

  it('should track version history', () => {
    manager.setIdentity(AGENT, { name: 'V1', changedBy: 'user', changeReason: 'Initial' });
    manager.setIdentity(AGENT, { name: 'V2', changedBy: 'user', changeReason: 'Update' });

    const history = manager.getVersionHistory(AGENT);
    expect(history).toHaveLength(1);
    expect(history[0].version).toBe(1);
    expect(history[0].changedBy).toBe('user');
    expect(history[0].changeReason).toBe('Update');
  });

  it('should rollback to a previous version', () => {
    manager.setIdentity(AGENT, { name: 'Original', role: 'V1 Role' });
    manager.setIdentity(AGENT, { name: 'Updated', role: 'V2 Role' });

    const current = manager.getIdentity(AGENT);
    expect(current!.name).toBe('Updated');
    expect(current!.version).toBe(2);

    const rolledBack = manager.rollback(AGENT, 1);
    expect(rolledBack.name).toBe('Original');
    expect(rolledBack.role).toBe('V1 Role');
    expect(rolledBack.version).toBe(3);
  });

  it('should throw on rollback to nonexistent version', () => {
    manager.setIdentity(AGENT, { name: 'V1' });
    expect(() => manager.rollback(AGENT, 99)).toThrow('Version 99 not found');
  });

  it('should preserve version history after rollback', () => {
    manager.setIdentity(AGENT, { name: 'V1' });
    manager.setIdentity(AGENT, { name: 'V2' });
    manager.rollback(AGENT, 1);

    const history = manager.getVersionHistory(AGENT);
    expect(history).toHaveLength(2);
    expect(history[0].version).toBe(2);
    expect(history[1].version).toBe(1);
  });

  it('should limit version history', () => {
    manager.setIdentity(AGENT, { name: 'V1' });
    manager.setIdentity(AGENT, { name: 'V2' });
    manager.setIdentity(AGENT, { name: 'V3' });
    manager.setIdentity(AGENT, { name: 'V4' });

    const limited = manager.getVersionHistory(AGENT, 2);
    expect(limited).toHaveLength(2);
    expect(limited[0].version).toBe(3);
    expect(limited[1].version).toBe(2);
  });

  // ─── Rendering ──────────────────────────────────────────────────────

  it('should render unknown agent markdown', () => {
    const md = manager.renderIdentityMarkdown('unknown');
    expect(md).toContain('Unknown Agent');
  });

  it('should render identity as markdown', () => {
    manager.setIdentity(AGENT, {
      name: 'TestBot',
      role: 'Runner',
      description: 'A helpful agent.',
      personality: ['precise', 'kind'],
    });
    manager.addGuideline(AGENT, { category: 'behavior', text: 'Be helpful' });
    manager.addGuideline(AGENT, { category: 'restriction', text: 'No secrets' });

    const md = manager.renderIdentityMarkdown(AGENT);
    expect(md).toContain('# TestBot');
    expect(md).toContain('**Role:** Runner');
    expect(md).toContain('A helpful agent.');
    expect(md).toContain('- precise');
    expect(md).toContain('- Be helpful');
    expect(md).toContain('- No secrets');
  });
});
