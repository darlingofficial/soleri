import { spawn } from 'node:child_process';
import type { Command } from 'commander';
import * as p from '@clack/prompts';
import { detectAgent } from '../utils/agent-context.js';

export function registerTest(program: Command): void {
  program
    .command('test')
    .description('Run agent tests via vitest')
    .option('-w, --watch', 'Run in watch mode')
    .option('--coverage', 'Run with coverage')
    .allowUnknownOption(true)
    .action((opts: { watch?: boolean; coverage?: boolean }, cmd) => {
      const ctx = detectAgent();
      if (!ctx) {
        p.log.error('No agent project detected in current directory. Run this from an agent root.');
        process.exit(1);
      }

      const args: string[] = [];
      if (opts.watch) {
        // vitest (no "run") enables watch mode
        args.push('vitest');
      } else {
        args.push('vitest', 'run');
      }
      if (opts.coverage) args.push('--coverage');

      // Forward any extra args the user passed
      const extra = cmd.args as string[];
      if (extra.length > 0) args.push(...extra);

      p.log.info(`Running tests for ${ctx.agentId}...`);

      const child = spawn('npx', args, {
        cwd: ctx.agentPath,
        stdio: 'inherit',
        env: { ...process.env },
      });

      child.on('error', (err) => {
        p.log.error(`Failed to start: ${err.message}`);
        p.log.info('Make sure vitest is available: npm install -D vitest');
        process.exit(1);
      });

      child.on('exit', (code, signal) => {
        if (signal) {
          p.log.warn(`Process terminated by signal ${signal}`);
          process.exit(1);
        }
        process.exit(code ?? 0);
      });
    });
}
