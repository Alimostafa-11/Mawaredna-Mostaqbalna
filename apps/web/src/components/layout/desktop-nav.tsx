'use client';

import { Button, Dropdown } from '@heroui/react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { PRIMARY_NAV, SECONDARY_NAV } from '@/lib/navigation-items';

/**
 * Desktop navigation bar. The site has twelve sections, which is more than a
 * single row can carry legibly, so the less-trafficked ones sit under "More".
 * Every one of them is still a first-class link in the mobile drawer and the
 * footer.
 */
export function DesktopNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const hasActiveSecondary = SECONDARY_NAV.some((item) => isActive(item.href));

  return (
    <nav aria-label={t('menu')} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {PRIMARY_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(item.href)
                  ? 'font-semibold text-brand-700 dark:text-brand-300'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          </li>
        ))}

        <li>
          <Dropdown>
            <Button
              variant="ghost"
              size="sm"
              className={hasActiveSecondary ? 'font-semibold text-brand-700' : undefined}
            >
              {t('more')}
              <ChevronDown aria-hidden className="size-4" />
            </Button>

            <Dropdown.Popover>
              <Dropdown.Menu onAction={(key) => router.push(String(key))}>
                {SECONDARY_NAV.map((item) => (
                  <Dropdown.Item
                    key={item.href}
                    id={item.href}
                    textValue={t(item.labelKey)}
                  >
                    {t(item.labelKey)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </li>
      </ul>
    </nav>
  );
}
