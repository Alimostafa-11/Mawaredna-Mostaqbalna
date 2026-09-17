'use client';

import { Inbox, LayoutDashboard, Plug, Rows3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Uses plain `next/link` rather than the i18n one: the dashboard sits outside
 * the `[locale]` segment, so its URLs carry no locale prefix.
 */
const ITEMS = [
  { href: '/dashboard', labelKey: 'nav.overview', Icon: LayoutDashboard },
  { href: '/dashboard/leads', labelKey: 'nav.leads', Icon: Inbox },
  { href: '/dashboard/content', labelKey: 'nav.content', Icon: Rows3 },
  { href: '/dashboard/api', labelKey: 'nav.api', Icon: Plug },
] as const;

export function DashboardNav() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();

  return (
    <nav aria-label={t('title')}>
      <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ITEMS.map(({ href, labelKey, Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-200'
                    : 'text-[var(--muted)] hover:bg-surface-secondary hover:text-[var(--foreground)]'
                }`}
              >
                <Icon aria-hidden className="size-4 shrink-0" />
                {t(labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
