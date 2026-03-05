import type { Config } from 'tailwindcss';
import { soleriPreset } from '@soleri/tokens/tailwind';

const config: Config = {
  presets: [soleriPreset],
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
