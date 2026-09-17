import { useTranslations } from 'next-intl';

/**
 * Visible only on keyboard focus. Keeps the long navigation bar from standing
 * between a keyboard or screen-reader user and the page content.
 */
export function SkipToContent() {
  const t = useTranslations('nav');

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
    >
      {t('skipToContent')}
    </a>
  );
}
