/** Semantic token references — CSS var() strings for Tailwind theme.extend consumption. */

/** Background tokens mapped to CSS custom properties. */
export const backgrounds = {
  background: 'var(--bg)',
  'background-warm': 'var(--bg-warm)',
  surface: 'var(--surface)',
  'surface-glass': 'var(--surface-glass)',
  'surface-elevated': 'var(--surface-elevated)',
} as const;

/** Foreground / text tokens. */
export const foregrounds = {
  foreground: 'var(--foreground)',
  'foreground-strong': 'var(--foreground-strong)',
  muted: 'var(--muted)',
} as const;

/** Border tokens. */
export const borders = {
  border: 'var(--border)',
  'border-subtle': 'var(--border-subtle)',
} as const;

/** Accent tokens. */
export const accents = {
  'accent-primary': 'var(--accent-primary)',
  'accent-teal': 'var(--accent-teal)',
  'accent-green': 'var(--accent-green)',
  ring: 'var(--ring)',
} as const;

/** Code block tokens. */
export const code = {
  'code-bg': 'var(--code-bg)',
  'code-fg': 'var(--code-fg)',
  'code-border': 'var(--code-border)',
  'code-prompt': 'var(--code-prompt)',
  'code-cmd': 'var(--code-cmd)',
  'code-arg': 'var(--code-arg)',
  'code-comment': 'var(--code-comment)',
  'code-key': 'var(--code-key)',
  'code-val': 'var(--code-val)',
  'code-ok': 'var(--code-ok)',
} as const;

/** Gradient tokens. */
export const gradients = {
  'hero-gradient': 'var(--hero-gradient)',
  'card-gradient': 'var(--card-gradient)',
} as const;

/** Opacity tokens. */
export const opacities = {
  'glow-amber': 'var(--glow-amber-opacity)',
  'glow-green': 'var(--glow-green-opacity)',
  'glow-teal': 'var(--glow-teal-opacity)',
  botanical: 'var(--botanical-opacity)',
} as const;

/** Light theme semantic properties (for reference/validation). */
export const lightThemeProperties = [
  'bg',
  'bg-warm',
  'surface',
  'surface-glass',
  'surface-elevated',
  'foreground',
  'foreground-strong',
  'muted',
  'border',
  'border-subtle',
  'accent-primary',
  'accent-teal',
  'accent-green',
  'ring',
  'code-bg',
  'code-fg',
  'code-border',
  'code-prompt',
  'code-cmd',
  'code-arg',
  'code-comment',
  'code-key',
  'code-val',
  'code-ok',
  'hero-gradient',
  'card-gradient',
  'glow-amber-opacity',
  'glow-green-opacity',
  'glow-teal-opacity',
  'botanical-opacity',
] as const;

/** Dark theme must define exactly the same properties. */
export const darkThemeProperties = lightThemeProperties;
