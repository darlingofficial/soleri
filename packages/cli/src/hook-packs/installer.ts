/**
 * Hook pack installer — copies hookify files to ~/.claude/ for global enforcement.
 */
import { existsSync, copyFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { getPack } from './registry.js';

/**
 * Resolve all hookify file paths for a pack, handling composed packs.
 * Returns a map of hook name → source file path.
 */
function resolveHookFiles(packName: string): Map<string, string> {
  const pack = getPack(packName);
  if (!pack) return new Map();

  const files = new Map<string, string>();

  if (pack.manifest.composedFrom) {
    // Composed pack: gather files from constituent packs
    for (const subPackName of pack.manifest.composedFrom) {
      const subFiles = resolveHookFiles(subPackName);
      for (const [hook, path] of subFiles) {
        files.set(hook, path);
      }
    }
  } else {
    // Direct pack: look for hookify files in the pack directory
    for (const hook of pack.manifest.hooks) {
      const filePath = join(pack.dir, `hookify.${hook}.local.md`);
      if (existsSync(filePath)) {
        files.set(hook, filePath);
      }
    }
  }

  return files;
}

/**
 * Install a hook pack globally to ~/.claude/.
 * Skips files that already exist (idempotent).
 */
export function installPack(packName: string): { installed: string[]; skipped: string[] } {
  const pack = getPack(packName);
  if (!pack) {
    throw new Error(`Unknown hook pack: "${packName}"`);
  }

  const claudeDir = join(homedir(), '.claude');
  mkdirSync(claudeDir, { recursive: true });

  const hookFiles = resolveHookFiles(packName);
  const installed: string[] = [];
  const skipped: string[] = [];

  for (const [hook, sourcePath] of hookFiles) {
    const destPath = join(claudeDir, `hookify.${hook}.local.md`);
    if (existsSync(destPath)) {
      skipped.push(hook);
    } else {
      copyFileSync(sourcePath, destPath);
      installed.push(hook);
    }
  }

  return { installed, skipped };
}

/**
 * Remove a hook pack's files from ~/.claude/.
 */
export function removePack(packName: string): { removed: string[] } {
  const pack = getPack(packName);
  if (!pack) {
    throw new Error(`Unknown hook pack: "${packName}"`);
  }

  const claudeDir = join(homedir(), '.claude');
  const removed: string[] = [];

  for (const hook of pack.manifest.hooks) {
    const filePath = join(claudeDir, `hookify.${hook}.local.md`);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      removed.push(hook);
    }
  }

  return { removed };
}

/**
 * Check if a pack is installed.
 * Returns true (all hooks present), false (none present), or 'partial'.
 */
export function isPackInstalled(packName: string): boolean | 'partial' {
  const pack = getPack(packName);
  if (!pack) return false;

  const claudeDir = join(homedir(), '.claude');
  let present = 0;

  for (const hook of pack.manifest.hooks) {
    if (existsSync(join(claudeDir, `hookify.${hook}.local.md`))) {
      present++;
    }
  }

  if (present === 0) return false;
  if (present === pack.manifest.hooks.length) return true;
  return 'partial';
}
