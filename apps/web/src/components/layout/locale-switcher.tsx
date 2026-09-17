'use client';

import { Button, Dropdown } from '@heroui/react';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { localeNames, locales, type Locale } from '@/i18n/routing';

/**
 * Switches language while staying on the same page.
 *
 * `usePathname` from our i18n navigation returns the path *without* the locale
 * prefix, so replacing it with a different locale lands on the same content
 * rather than sending the visitor back to the home page.
 */
export function LocaleSwitcher({ current }: { current: Locale }) {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <Dropdown>
      <Button
        variant="ghost"
        size="sm"
        isDisabled={isPending}
        aria-label={t('switchLanguage')}
      >
        <Globe aria-hidden className="size-4" />
        <span className="hidden sm:inline">{localeNames[current]}</span>
      </Button>

      <Dropdown.Popover>
        <Dropdown.Menu
          selectionMode="single"
          selectedKeys={[current]}
          onAction={(key) => {
            startTransition(() => {
              router.replace(pathname, { locale: key as Locale });
            });
          }}
        >
          {locales.map((locale) => (
            <Dropdown.Item key={locale} id={locale} textValue={localeNames[locale]}>
              {localeNames[locale]}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
