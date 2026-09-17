import { defineRouting } from 'next-intl/routing';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

/** Text direction per locale — drives `dir` on <html> and RTL-aware layout. */
export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
};

/**
 * Arabic is the site's primary language. `localePrefix: 'always'` keeps both
 * languages on explicit, indexable URLs (/ar/..., /en/...) rather than hiding
 * the default one, which keeps hreflang and sitemap generation honest.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});
