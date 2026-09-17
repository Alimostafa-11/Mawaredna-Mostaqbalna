import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // The company operates in Egypt; pinning the zone keeps server-rendered
    // dates identical to what visitors see.
    timeZone: 'Africa/Cairo',
    now: new Date(),
  };
});
