'use client';

import { Button, Drawer } from '@heroui/react';
import { Menu as MenuIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from '@/lib/navigation-items';

/**
 * Full navigation for small screens. The desktop bar hides some sections
 * behind a "More" menu; this list always shows every one of them.
 */
export function MobileNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="sm"
        isIconOnly
        className="lg:hidden"
        aria-label={t('openMenu')}
      >
        <MenuIcon aria-hidden className="size-5" />
      </Button>

      {/* Placement is physical, so mirror it for the RTL layout. */}
      <Drawer.Content placement={locale === 'ar' ? 'right' : 'left'}>
        <Drawer.Dialog aria-label={t('menu')}>
          <Drawer.Header>
            <Drawer.Heading>{t('menu')}</Drawer.Heading>
            <Drawer.CloseTrigger aria-label={t('closeMenu')} />
          </Drawer.Header>

          <Drawer.Body>
            <nav aria-label={t('menu')}>
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        // Close on selection: the drawer would otherwise stay
                        // open over the page the visitor just asked for.
                        onClick={() => setIsOpen(false)}
                        className={`block rounded-lg px-3 py-2.5 text-base transition-colors ${
                          isActive
                            ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-200'
                            : 'hover:bg-surface-secondary'
                        }`}
                      >
                        {t(item.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </Drawer.Body>

          <Drawer.Footer>
            <Link
              href="/request"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-center font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {t('request')}
            </Link>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer>
  );
}
