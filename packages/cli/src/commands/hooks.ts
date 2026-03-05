import type { Command } from 'commander';
import { SUPPORTED_EDITORS, type EditorId } from '../hooks/templates.js';
import { installHooks, removeHooks, detectInstalledHooks } from '../hooks/generator.js';
import { detectAgent } from '../utils/agent-context.js';
import { listPacks, getPack } from '../hook-packs/registry.js';
import { installPack, removePack, isPackInstalled } from '../hook-packs/installer.js';
import * as log from '../utils/logger.js';

export function registerHooks(program: Command): void {
  const hooks = program.command('hooks').description('Manage editor hooks and hook packs');

  hooks
    .command('add')
    .argument('<editor>', `Editor: ${SUPPORTED_EDITORS.join(', ')}`)
    .description('Generate editor hooks/config files')
    .action((editor: string) => {
      if (!isValidEditor(editor)) {
        log.fail(`Unknown editor "${editor}". Supported: ${SUPPORTED_EDITORS.join(', ')}`);
        process.exit(1);
      }

      const ctx = detectAgent();
      if (!ctx) {
        log.fail('No agent project detected in current directory.');
        process.exit(1);
      }

      const files = installHooks(editor, ctx.agentPath);
      for (const f of files) {
        log.pass(`Created ${f}`);
      }
      log.info(`${editor} hooks installed for ${ctx.agentId}`);
    });

  hooks
    .command('remove')
    .argument('<editor>', `Editor: ${SUPPORTED_EDITORS.join(', ')}`)
    .description('Remove editor hooks/config files')
    .action((editor: string) => {
      if (!isValidEditor(editor)) {
        log.fail(`Unknown editor "${editor}". Supported: ${SUPPORTED_EDITORS.join(', ')}`);
        process.exit(1);
      }

      const ctx = detectAgent();
      if (!ctx) {
        log.fail('No agent project detected in current directory.');
        process.exit(1);
      }

      const removed = removeHooks(editor, ctx.agentPath);
      if (removed.length === 0) {
        log.info(`No ${editor} hooks found to remove.`);
      } else {
        for (const f of removed) {
          log.warn(`Removed ${f}`);
        }
        log.info(`${editor} hooks removed from ${ctx.agentId}`);
      }
    });

  hooks
    .command('list')
    .description('Show which editor hooks are installed')
    .action(() => {
      const ctx = detectAgent();
      if (!ctx) {
        log.fail('No agent project detected in current directory.');
        process.exit(1);
      }

      const installed = detectInstalledHooks(ctx.agentPath);

      log.heading(`Editor hooks for ${ctx.agentId}`);

      for (const editor of SUPPORTED_EDITORS) {
        if (installed.includes(editor)) {
          log.pass(editor, 'installed');
        } else {
          log.dim(`  ${editor} — not installed`);
        }
      }
    });

  // ── Hook Pack subcommands ──

  hooks
    .command('add-pack')
    .argument('<pack>', 'Hook pack name')
    .description('Install a hook pack globally (~/.claude/)')
    .action((packName: string) => {
      const pack = getPack(packName);
      if (!pack) {
        const available = listPacks().map((p) => p.name);
        log.fail(`Unknown pack "${packName}". Available: ${available.join(', ')}`);
        process.exit(1);
      }

      const { installed, skipped } = installPack(packName);
      for (const hook of installed) {
        log.pass(`Installed hookify.${hook}.local.md`);
      }
      for (const hook of skipped) {
        log.dim(`  hookify.${hook}.local.md — already exists, skipped`);
      }
      if (installed.length > 0) {
        log.info(`Pack "${packName}" installed (${installed.length} hooks)`);
      } else {
        log.info(`Pack "${packName}" — all hooks already installed`);
      }
    });

  hooks
    .command('remove-pack')
    .argument('<pack>', 'Hook pack name')
    .description('Remove a hook pack from ~/.claude/')
    .action((packName: string) => {
      const pack = getPack(packName);
      if (!pack) {
        const available = listPacks().map((p) => p.name);
        log.fail(`Unknown pack "${packName}". Available: ${available.join(', ')}`);
        process.exit(1);
      }

      const { removed } = removePack(packName);
      if (removed.length === 0) {
        log.info(`No hooks from pack "${packName}" found to remove.`);
      } else {
        for (const hook of removed) {
          log.warn(`Removed hookify.${hook}.local.md`);
        }
        log.info(`Pack "${packName}" removed (${removed.length} hooks)`);
      }
    });

  hooks
    .command('list-packs')
    .description('Show available hook packs and their status')
    .action(() => {
      const packs = listPacks();

      log.heading('Hook Packs');

      for (const pack of packs) {
        const status = isPackInstalled(pack.name);

        if (status === true) {
          log.pass(`${pack.name}`, `${pack.description} (${pack.hooks.length} hooks)`);
        } else if (status === 'partial') {
          log.warn(`${pack.name}`, `${pack.description} (${pack.hooks.length} hooks) — partial`);
        } else {
          log.dim(`  ${pack.name} — ${pack.description} (${pack.hooks.length} hooks)`);
        }
      }
    });
}

function isValidEditor(editor: string): editor is EditorId {
  return (SUPPORTED_EDITORS as readonly string[]).includes(editor);
}
