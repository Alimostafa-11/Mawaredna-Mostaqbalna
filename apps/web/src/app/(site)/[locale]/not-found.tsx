import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-28 text-center">
      <p className="text-6xl font-bold text-brand-600 tabular">404</p>

      <h1 className="text-2xl font-bold lg:text-3xl">{t('notFoundTitle')}</h1>
      <p className="text-[var(--muted)]">{t('notFoundBody')}</p>

      <Link
        href="/"
        className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        {tCommon('backHome')}
      </Link>
    </div>
  );
}
