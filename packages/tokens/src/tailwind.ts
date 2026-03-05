import type { Config } from 'tailwindcss';
import { colors, shadows, radii } from './primitives.js';
import { backgrounds, foregrounds, borders, accents, code } from './semantic.js';

/** Convert a primitive color scale to Tailwind `var()` refs. */
function cssVarScale(prefix: string, scale: Record<string | number, string>) {
  const result: Record<string, string> = {};
  for (const shade of Object.keys(scale)) {
    result[shade] = `var(--color-${prefix}-${shade})`;
  }
  return result;
}

/**
 * Soleri Tailwind preset.
 *
 * Usage in tailwind.config.ts:
 *   import { soleriPreset } from '@soleri/tokens/tailwind';
 *   export default { presets: [soleriPreset], ... }
 */
export const soleriPreset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        /* Primitive scales */
        primary: cssVarScale('primary', colors.primary),
        secondary: cssVarScale('secondary', colors.secondary),
        tertiary: cssVarScale('tertiary', colors.tertiary),
        neutral: cssVarScale('neutral', colors.neutral),
        white: 'var(--color-white)',
        black: 'var(--color-black)',

        /* Semantic */
        background: backgrounds.background,
        'background-warm': backgrounds['background-warm'],
        surface: backgrounds.surface,
        'surface-glass': backgrounds['surface-glass'],
        'surface-elevated': backgrounds['surface-elevated'],
        foreground: foregrounds.foreground,
        'foreground-strong': foregrounds['foreground-strong'],
        muted: foregrounds.muted,
        border: borders.border,
        'border-subtle': borders['border-subtle'],
        'accent-primary': accents['accent-primary'],
        'accent-teal': accents['accent-teal'],
        'accent-green': accents['accent-green'],
        ring: accents.ring,

        /* Code block */
        ...code,
      },
      boxShadow: {
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
        'glow-amber': shadows['glow-amber'],
        'glow-teal': shadows['glow-teal'],
        'glow-green': shadows['glow-green'],
      },
      borderRadius: {
        sm: radii.sm,
        md: radii.md,
        lg: radii.lg,
        xl: radii.xl,
        '2xl': radii['2xl'],
        full: radii.full,
      },
      backgroundImage: {
        'hero-gradient': 'var(--hero-gradient)',
        'card-gradient': 'var(--card-gradient)',
      },
    },
  },
};
