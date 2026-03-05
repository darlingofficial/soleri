import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// Mock homedir to use a temp directory instead of real ~/.claude/
const tempHome = join(tmpdir(), `cli-hookpacks-test-${Date.now()}`);

vi.mock('node:os', async () => {
  const actual = await vi.importActual<typeof import('node:os')>('node:os');
  return { ...actual, homedir: () => tempHome };
});

import { listPacks, getPack, getInstalledPacks } from '../hook-packs/registry.js';
import { installPack, removePack, isPackInstalled } from '../hook-packs/installer.js';

describe('hook-packs', () => {
  beforeEach(() => {
    mkdirSync(join(tempHome, '.claude'), { recursive: true });
  });

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true });
  });

  describe('registry', () => {
    it('should list all 5 built-in packs', () => {
      const packs = listPacks();
      expect(packs.length).toBe(5);

      const names = packs.map((p) => p.name).sort();
      expect(names).toEqual([
        'a11y',
        'clean-commits',
        'css-discipline',
        'full',
        'typescript-safety',
      ]);
    });

    it('should get a specific pack by name', () => {
      const pack = getPack('typescript-safety');
      expect(pack).not.toBeNull();
      expect(pack!.manifest.name).toBe('typescript-safety');
      expect(pack!.manifest.hooks).toEqual(['no-any-types', 'no-console-log']);
      expect(pack!.manifest.description).toBe('Block unsafe TypeScript patterns');
    });

    it('should return null for unknown pack', () => {
      expect(getPack('nonexistent')).toBeNull();
    });

    it('should return full pack with composedFrom', () => {
      const pack = getPack('full');
      expect(pack).not.toBeNull();
      expect(pack!.manifest.composedFrom).toEqual([
        'typescript-safety',
        'a11y',
        'css-discipline',
        'clean-commits',
      ]);
      expect(pack!.manifest.hooks).toHaveLength(8);
    });

    it('should return empty installed packs when none installed', () => {
      expect(getInstalledPacks()).toEqual([]);
    });
  });

  describe('installer', () => {
    it('should install a simple pack', () => {
      const result = installPack('typescript-safety');

      expect(result.installed).toEqual(['no-any-types', 'no-console-log']);
      expect(result.skipped).toEqual([]);

      const claudeDir = join(tempHome, '.claude');
      expect(existsSync(join(claudeDir, 'hookify.no-any-types.local.md'))).toBe(true);
      expect(existsSync(join(claudeDir, 'hookify.no-console-log.local.md'))).toBe(true);

      // Verify content was copied correctly
      const content = readFileSync(join(claudeDir, 'hookify.no-any-types.local.md'), 'utf-8');
      expect(content).toContain('name: no-any-types');
      expect(content).toContain('Soleri Hook Pack: typescript-safety');
    });

    it('should be idempotent — skip existing files', () => {
      installPack('typescript-safety');
      const result = installPack('typescript-safety');

      expect(result.installed).toEqual([]);
      expect(result.skipped).toEqual(['no-any-types', 'no-console-log']);
    });

    it('should install composed pack (full)', () => {
      const result = installPack('full');

      expect(result.installed).toHaveLength(8);
      expect(result.skipped).toEqual([]);

      const claudeDir = join(tempHome, '.claude');
      const expectedHooks = [
        'no-any-types',
        'no-console-log',
        'no-important',
        'no-inline-styles',
        'semantic-html',
        'focus-ring-required',
        'ux-touch-targets',
        'no-ai-attribution',
      ];
      for (const hook of expectedHooks) {
        expect(existsSync(join(claudeDir, `hookify.${hook}.local.md`))).toBe(true);
      }
    });

    it('should skip already-installed hooks when installing full after partial', () => {
      installPack('typescript-safety');
      const result = installPack('full');

      expect(result.skipped).toContain('no-any-types');
      expect(result.skipped).toContain('no-console-log');
      expect(result.installed).toHaveLength(6); // 8 total - 2 already installed
    });

    it('should throw for unknown pack', () => {
      expect(() => installPack('nonexistent')).toThrow('Unknown hook pack: "nonexistent"');
    });

    it('should remove a pack', () => {
      installPack('a11y');
      const result = removePack('a11y');

      expect(result.removed).toEqual(['semantic-html', 'focus-ring-required', 'ux-touch-targets']);

      const claudeDir = join(tempHome, '.claude');
      expect(existsSync(join(claudeDir, 'hookify.semantic-html.local.md'))).toBe(false);
    });

    it('should return empty removed list when pack not installed', () => {
      const result = removePack('a11y');
      expect(result.removed).toEqual([]);
    });

    it('should throw for unknown pack on remove', () => {
      expect(() => removePack('nonexistent')).toThrow('Unknown hook pack: "nonexistent"');
    });
  });

  describe('isPackInstalled', () => {
    it('should return false when nothing installed', () => {
      expect(isPackInstalled('typescript-safety')).toBe(false);
    });

    it('should return true when fully installed', () => {
      installPack('typescript-safety');
      expect(isPackInstalled('typescript-safety')).toBe(true);
    });

    it('should return partial when some hooks present', () => {
      // Install just one of the two hooks
      const claudeDir = join(tempHome, '.claude');
      writeFileSync(join(claudeDir, 'hookify.no-any-types.local.md'), 'test');
      expect(isPackInstalled('typescript-safety')).toBe('partial');
    });

    it('should return false for unknown pack', () => {
      expect(isPackInstalled('nonexistent')).toBe(false);
    });
  });

  describe('getInstalledPacks', () => {
    it('should list installed packs', () => {
      installPack('typescript-safety');
      installPack('a11y');

      const installed = getInstalledPacks();
      expect(installed).toContain('typescript-safety');
      expect(installed).toContain('a11y');
      expect(installed).not.toContain('css-discipline');
    });

    it('should include full when all 8 hooks are present', () => {
      installPack('full');

      const installed = getInstalledPacks();
      // All packs should show as installed since full installs all hooks
      expect(installed).toContain('full');
      expect(installed).toContain('typescript-safety');
      expect(installed).toContain('a11y');
      expect(installed).toContain('css-discipline');
      expect(installed).toContain('clean-commits');
    });
  });
});
