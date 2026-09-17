'use client';

import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

/**
 * Route-level error boundary. Shows a translated message rather than the raw
 * error, which may contain internal detail.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    // Surfaces in the container logs, where CloudWatch can pick it up.
    console.error('Unhandled route error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-28 text-center">
      <h1 className="text-2xl font-bold lg:text-3xl">{t('genericTitle')}</h1>
      <p className="text-[var(--muted)]">{t('genericBody')}</p>

      {error.digest && (
        <p className="text-xs text-[var(--muted)] tabular" dir="ltr">
          {error.digest}
        </p>
      )}

      <Button onPress={reset} size="lg">
        {t('retry')}
      </Button>
    </div>
  );
}
