/** Primitive color scales — raw hex values keyed by shade. */
export const colors = {
  primary: {
    25: '#FBF6ED',
    50: '#F9EAD6',
    100: '#FADFBD',
    200: '#F6D09D',
    300: '#EFBC75',
    400: '#E8A847',
    500: '#C88F37',
    600: '#6D4300',
    700: '#5E3D03',
    800: '#4F3816',
    900: '#41321F',
  },
  secondary: {
    50: '#D7E2E7',
    100: '#C1DDE9',
    200: '#A3D4E7',
    300: '#78C4E1',
    400: '#50B1D3',
    500: '#239DC3',
    600: '#005774',
    700: '#004A62',
    800: '#023E50',
    900: '#0F323F',
  },
  tertiary: {
    50: '#E4F1DD',
    100: '#D5EDC9',
    200: '#C1E3AF',
    300: '#A9D68F',
    400: '#91C96E',
    500: '#7AAC5B',
    600: '#345918',
    700: '#324E1F',
    800: '#304423',
    900: '#2D3A26',
  },
  neutral: {
    50: '#D9DCDF',
    100: '#CED4DB',
    200: '#BFC7D3',
    300: '#A9B4C5',
    400: '#919EB2',
    500: '#7A899F',
    550: '#5C6B7F',
    600: '#3F4E63',
    700: '#374253',
    800: '#2E3744',
    900: '#252C36',
    940: '#1E2530',
    950: '#1A1F26',
    975: '#151A21',
  },
  zinc: {
    200: '#e4e4e7',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    950: '#09090b',
  },
  error: {
    500: '#FF5F57',
    600: '#C05050',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

/** RGB channel values for alpha compositing: `rgb(var(--x-rgb) / alpha)`. */
export const colorChannels = {
  'primary-400': '232 168 71',
  'primary-500': '200 143 55',
  'primary-900': '65 50 31',
  'secondary-500': '35 157 195',
  'secondary-900': '15 50 63',
  'tertiary-400': '145 201 110',
  'tertiary-500': '122 172 91',
  'tertiary-900': '45 58 38',
  'neutral-200': '191 199 211',
  'neutral-700': '55 66 83',
  'neutral-800': '46 55 68',
  'neutral-900': '37 44 54',
  'error-600': '200 80 80',
  white: '255 255 255',
  black: '0 0 0',
} as const;

/** Ray glow derived RGB channels (ambient light particle effects). */
export const rayChannels = {
  'amber-soft': '255 220 140',
  'amber-tip': '255 240 180',
  'amber-halo': '255 230 160',
  'teal-mid': '120 200 230',
  'teal-tip': '180 230 250',
  'teal-halo': '160 220 240',
} as const;

/** Box shadows — use CSS var() channel refs. */
export const shadows = {
  sm: '0 1px 3px 0 rgb(var(--color-black-rgb) / 0.06)',
  md: '0 8px 24px -8px rgb(var(--color-black-rgb) / 0.12)',
  lg: '0 16px 48px -12px rgb(var(--color-black-rgb) / 0.15)',
  'glow-amber': '0 0 60px -12px rgb(var(--color-primary-400-rgb) / 0.2)',
  'glow-teal': '0 0 60px -12px rgb(var(--color-secondary-500-rgb) / 0.15)',
  'glow-green': '0 0 60px -12px rgb(var(--color-tertiary-400-rgb) / 0.15)',
} as const;

/** Border radii. */
export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const;
