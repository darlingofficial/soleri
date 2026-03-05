export type Locale = 'en' | 'uk' | 'it';

export const locales: Locale[] = ['en', 'uk', 'it'];

export const defaultLocale: Locale = 'en';

/** BCP 47 / ISO mapping for hreflang (uk → uk, not ua) */
export const hreflangMap: Record<Locale, string> = {
  en: 'en',
  uk: 'uk',
  it: 'it',
};

/** Display labels for the language switcher UI */
export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  uk: 'UA',
  it: 'IT',
};

export const SITE_URL = 'https://soleri.ai';
