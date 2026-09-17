import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { ThemeScript } from '@/components/layout/theme-toggle';
import { defaultLocale, localeDirection } from '@/i18n/routing';
import '../../globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

/**
 * The dashboard is a second root layout, parallel to the public site's. It
 * lives outside the `[locale]` segment on purpose: `/dashboard` is internal
 * tooling, so it has no localized URLs, no hreflang and no sitemap entry.
 *
 * It runs in the site's default language (Arabic). The strings are in the
 * normal message catalogues under `dashboard`, so adding a language switcher
 * later is a small change rather than a rewrite.
 */
export const metadata: Metadata = {
  title: {
    default: 'لوحة التحكم',
    template: '%s | لوحة التحكم',
  },
  // Internal tooling must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  setRequestLocale(defaultLocale);

  const messages = await getMessages({ locale: defaultLocale });
  const t = await getTranslations({ locale: defaultLocale, namespace: 'dashboard' });

  return (
    <html
      lang={defaultLocale}
      dir={localeDirection[defaultLocale]}
      className={cairo.variable}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-[var(--surface-secondary)] antialiased">
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
          <Providers locale={defaultLocale}>
            <a
              href="#dashboard-content"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
            >
              {t('nav.overview')}
            </a>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
