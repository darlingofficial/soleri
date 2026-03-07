import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { dedupItems, DEDUP_THRESHOLD } from '../intake/dedup-gate.js';
import { Vault } from '../vault/vault.js';
import type { ClassifiedItem } from '../intake/types.js';

function makeItem(overrides: Partial<ClassifiedItem> = {}): ClassifiedItem {
  return {
    type: overrides.type ?? 'pattern',
    title: overrides.title ?? 'Test Pattern',
    description: overrides.description ?? 'A generic test description.',
    tags: overrides.tags ?? ['test'],
    severity: overrides.severity ?? 'suggestion',
    citation: overrides.citation ?? 'p.1',
  };
}

describe('Dedup Gate', () => {
  let vault: Vault;

  beforeEach(() => {
    vault = new Vault(':memory:');
  });

  afterEach(() => {
    vault.close();
  });

  it('should mark items as non-duplicate when vault is empty', () => {
    const items: ClassifiedItem[] = [
      makeItem({ title: 'Brand New Pattern', description: 'Something entirely new.' }),
    ];

    const results = dedupItems(items, vault);

    expect(results).toHaveLength(1);
    expect(results[0].isDuplicate).toBe(false);
    expect(results[0].similarity).toBe(0);
    expect(results[0].bestMatchId).toBeUndefined();
    expect(results[0].item).toBe(items[0]);
  });

  it('should detect near-duplicates with high similarity', () => {
    vault.seed([
      {
        id: 'existing-1',
        type: 'pattern',
        domain: 'design-patterns',
        title: 'Singleton Pattern Implementation',
        severity: 'suggestion',
        description:
          'The singleton pattern ensures a class has only one instance and provides a global point of access to it.',
        tags: ['singleton', 'design-pattern', 'creational'],
      },
    ]);

    const items: ClassifiedItem[] = [
      makeItem({
        title: 'Singleton Pattern Implementation',
        description:
          'The singleton pattern ensures a class has only one instance and provides a global point of access to it.',
        tags: ['singleton', 'design-pattern', 'creational'],
      }),
    ];

    const results = dedupItems(items, vault);

    expect(results).toHaveLength(1);
    expect(results[0].similarity).toBeGreaterThan(0.5);
    expect(results[0].bestMatchId).toBe('existing-1');
  });

  it('should not flag dissimilar entries as duplicates', () => {
    vault.seed([
      {
        id: 'existing-2',
        type: 'pattern',
        domain: 'design-patterns',
        title: 'Observer Pattern',
        severity: 'suggestion',
        description:
          'The observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.',
        tags: ['observer', 'design-pattern', 'behavioral'],
      },
    ]);

    const items: ClassifiedItem[] = [
      makeItem({
        title: 'God Object Anti-Pattern',
        description:
          'A god object is an anti-pattern where a single class knows too much or does too much, violating the single responsibility principle.',
        tags: ['anti-pattern', 'code-smell'],
      }),
    ];

    const results = dedupItems(items, vault);

    expect(results).toHaveLength(1);
    expect(results[0].isDuplicate).toBe(false);
  });

  it('should handle multiple items at once', () => {
    vault.seed([
      {
        id: 'existing-3',
        type: 'pattern',
        domain: 'design-patterns',
        title: 'Factory Method Pattern',
        severity: 'suggestion',
        description:
          'The factory method pattern defines an interface for creating an object but lets subclasses decide which class to instantiate.',
        tags: ['factory', 'design-pattern', 'creational'],
      },
    ]);

    const items: ClassifiedItem[] = [
      // Near-duplicate of vault entry
      makeItem({
        title: 'Factory Method Pattern',
        description:
          'The factory method pattern defines an interface for creating an object but lets subclasses decide which class to instantiate.',
        tags: ['factory', 'design-pattern', 'creational'],
      }),
      // Completely different
      makeItem({
        title: 'Dependency Injection',
        description:
          'Dependency injection is a technique where an object receives other objects that it depends on, called dependencies, rather than creating them internally.',
        tags: ['dependency-injection', 'inversion-of-control'],
      }),
      // Also different
      makeItem({
        title: 'Circuit Breaker Pattern',
        description:
          'The circuit breaker pattern prevents an application from repeatedly trying to execute an operation that is likely to fail, allowing it to recover gracefully.',
        tags: ['resilience', 'distributed-systems'],
      }),
    ];

    const results = dedupItems(items, vault);

    expect(results).toHaveLength(3);

    // First item is a near-duplicate — should have high similarity
    expect(results[0].similarity).toBeGreaterThan(0.5);
    expect(results[0].bestMatchId).toBe('existing-3');

    // Second and third items are different — should not be duplicates
    expect(results[1].isDuplicate).toBe(false);
    expect(results[2].isDuplicate).toBe(false);
  });

  it('DEDUP_THRESHOLD should be 0.85', () => {
    expect(DEDUP_THRESHOLD).toBe(0.85);
  });
});

describe('Intake Types', () => {
  it('should import all type definitions', async () => {
    const types = await import('../intake/types.js');
    expect(types).toBeDefined();
  });
});
