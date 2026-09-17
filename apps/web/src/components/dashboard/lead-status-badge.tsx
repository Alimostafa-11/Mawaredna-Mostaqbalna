import { useTranslations } from 'next-intl';
import type { InquiryStatus } from '@/lib/admin-types';

/**
 * Colour carries meaning here, so the label is always rendered too rather
 * than relying on the dot alone.
 */
const STATUS_CLASSES: Record<InquiryStatus, string> = {
  new: 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-200',
  'in-progress':
    'border-soil-300 bg-soil-50 text-soil-800 dark:border-soil-700 dark:bg-soil-900/40 dark:text-soil-200',
  quoted:
    'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
  closed: 'border-[var(--border)] bg-surface-secondary text-[var(--muted)]',
};

export function LeadStatusBadge({ status }: { status: InquiryStatus }) {
  const t = useTranslations('dashboard.statuses');

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {t(status)}
    </span>
  );
}
