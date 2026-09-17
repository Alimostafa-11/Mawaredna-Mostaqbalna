import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipToContent } from '@/components/layout/skip-to-content';
import { ThemeScript } from '@/components/layout/theme-toggle';
import { locales, localeDirection, type Locale } from '@/i18n/routing';
import { getSettings } from '@/lib/api';
import '../../globals.css';

/**
 * Cairo covers both Arabic and Latin, so the site keeps one type voice when a
 * visitor switches language.
 */
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${t('siteName')} | ${t('tagline')}`,
      template: `%s | ${t('siteName')}`,
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: '/ar',
        en: '/en',
        'x-default': '/ar',
      },
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title: `${t('siteName')} | ${t('tagline')}`,
      description: t('description'),
      locale: locale === 'ar' ? 'ar_EG' : 'en_GB',
      url: `/${locale}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;

  // Required for the statically rendered pages below to resolve messages.
  setRequestLocale(typedLocale);

  const settings = await getSettings();

  return (
    <html
      lang={typedLocale}
      dir={localeDirection[typedLocale]}
      className={cairo.variable}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>
          <Providers locale={typedLocale}>
            <SkipToContent />
            <div className="flex min-h-dvh flex-col">
              <SiteHeader locale={typedLocale} settings={settings} />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <SiteFooter locale={typedLocale} settings={settings} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
