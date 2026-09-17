'use client';

import { I18nProvider, RouterProvider } from '@heroui/react/rac';
import { Toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';

interface ProvidersProps {
  locale: Locale;
  children: ReactNode;
}

/**
 * HeroUI v3 has no single root provider. What the app actually needs is:
 *
 * - `I18nProvider` so React Aria formats dates/numbers for the locale and
 *   flips its own RTL-aware behaviour for Arabic.
 * - `RouterProvider` so `href` on a HeroUI Link or Button navigates through
 *   the Next router instead of triggering a full page load.
 * - `Toast.Provider` so form submissions can report their outcome.
 */
export function Providers({ locale, children }: ProvidersProps) {
  const router = useRouter();

  return (
    <I18nProvider locale={locale === 'ar' ? 'ar-EG' : 'en-GB'}>
      <RouterProvider navigate={router.push}>
        {children}
        {/* Logical placement, so toasts sit on the trailing edge in both
            writing directions. */}
        <Toast.Provider placement="bottom end" />
      </RouterProvider>
    </I18nProvider>
  );
}
