import { Leaf } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { SiteSettings } from '@/lib/types';
import { localized } from '@/lib/utils';
import { DesktopNav } from './desktop-nav';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';

interface SiteHeaderProps {
  locale: Locale;
  settings: SiteSettings | null;
}

export async function SiteHeader({ locale, settings }: SiteHeaderProps) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });

  const companyName = settings
    ? localized(settings.companyName, locale)
    : tMeta('siteName');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">

<Link href="/" className="flex shrink-0 items-center gap-2.5">
  <Image
    src="/company-logo.jpeg"
    alt={companyName}
    width={44}
    height={44}
    className="size-10 rounded-lg object-contain lg:size-11"
    priority
  />

  <span className="flex flex-col leading-tight">
    <span className="text-base font-bold lg:text-lg">{companyName}</span>

    <span className="hidden text-xs text-[var(--muted)] sm:block">
      {settings?.slogan
        ? localized(settings.slogan, locale)
        : tMeta('tagline')}
    </span>
  </span>
</Link>
        <div className="flex-1" />

        <DesktopNav />

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <LocaleSwitcher current={locale} />

          <Link
            href="/request"
            className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-block"
          >
            {t('request')}
          </Link>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
