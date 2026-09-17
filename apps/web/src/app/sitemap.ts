import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { NAV_ITEMS } from '@/lib/navigation-items';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Every page exists in both languages, so each entry carries the alternates
 * that tell search engines the two URLs are the same content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    NAV_ITEMS.map((item) => {
      const path = item.href === '/' ? '' : item.href;

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: item.href === '/' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((alt) => [alt, `${SITE_URL}/${alt}${path}`]),
          ),
        },
      };
    }),
  );
}
