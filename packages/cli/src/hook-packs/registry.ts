/**
 * Hook pack registry — discovers built-in packs and checks installation status.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

export interface HookPackManifest {
  name: string;
  description: string;
  hooks: string[];
  composedFrom?: string[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Root directory containing all built-in hook packs. */
function getPacksRoot(): string {
  return __dirname;
}

/**
 * List all available built-in hook packs.
 */
export function listPacks(): HookPackManifest[] {
  const root = getPacksRoot();
  const entries = readdirSync(root, { withFileTypes: true });
  const packs: HookPackManifest[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = join(root, entry.name, 'manifest.json');
    if (!existsSync(manifestPath)) continue;

    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as HookPackManifest;
      packs.push(manifest);
    } catch {
      // Skip malformed manifests
    }
  }

  return packs;
}

/**
 * Get a specific pack by name.
 */
export function getPack(name: string): { manifest: HookPackManifest; dir: string } | null {
  const root = getPacksRoot();
  const dir = join(root, name);
  const manifestPath = join(dir, 'manifest.json');

  if (!existsSync(manifestPath)) return null;

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as HookPackManifest;
    return { manifest, dir };
  } catch {
    return null;
  }
}

/**
 * Get names of packs that are fully installed in ~/.claude/.
 */
export function getInstalledPacks(): string[] {
  const claudeDir = join(homedir(), '.claude');
  const packs = listPacks();
  const installed: string[] = [];

  for (const pack of packs) {
    const allPresent = pack.hooks.every((hook) =>
      existsSync(join(claudeDir, `hookify.${hook}.local.md`)),
    );
    if (allPresent) {
      installed.push(pack.name);
    }
  }

  return installed;
}
