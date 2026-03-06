import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import type { Command } from 'commander';
import * as log from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getCurrentVersion(): string {
  const pkgPath = join(__dirname, '..', '..', 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  return pkg.version as string;
}

function getLatestVersion(): string {
  return execFileSync('npm', ['view', '@soleri/cli', 'version'], {
    encoding: 'utf-8',
    timeout: 10_000,
  }).trim();
}

export function registerUpgrade(program: Command): void {
  program
    .command('upgrade')
    .description('Upgrade @soleri/cli to the latest version')
    .option('--check', 'Show current vs latest version without upgrading')
    .action((opts: { check?: boolean }) => {
      const current = getCurrentVersion();

      log.heading('@soleri/cli upgrade');

      let latest: string;
      try {
        latest = getLatestVersion();
      } catch {
        log.fail('Could not reach npm registry');
        log.info('Check your internet connection and try again.');
        process.exit(1);
      }

      if (current === latest) {
        log.pass(`@soleri/cli@${current}`, 'already up to date');
        return;
      }

      log.info(`Current: ${current}`);
      log.info(`Latest:  ${latest}`);

      if (opts.check) {
        log.dim(`Run "npm install -g @soleri/cli@latest" to upgrade.`);
        return;
      }

      log.info('Upgrading...');
      try {
        execFileSync('npm', ['install', '-g', '@soleri/cli@latest'], {
          stdio: 'inherit',
          timeout: 60_000,
        });
        log.pass(`Upgraded to @soleri/cli@${latest}`);
      } catch {
        log.fail('Upgrade failed');
        log.info(`Try manually: npm install -g @soleri/cli@${latest}`);
        process.exit(1);
      }
    });
}
