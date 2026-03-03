import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: [],
      project: ['*.ts'],
      ignoreDependencies: [
        '@secretlint/secretlint-rule-preset-recommend', // secretlint plugin
      ],
    },
    'packages/forge': {
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        '@vitest/coverage-v8', // optional vitest plugin
      ],
    },
  },
};

export default config;
