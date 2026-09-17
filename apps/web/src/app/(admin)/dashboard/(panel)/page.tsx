import { Inbox } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { LeadStatusBadge } from '@/components/dashboard/lead-status-badge';
import { defaultLocale } from '@/i18n/routing';
import { adminFetchOrLogin, requireAdminToken } from '@/lib/admin-auth';
import type { Inquiry, InquiryStats, Paginated } from '@/lib/admin-types';
import { formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const token = await requireAdminToken();
  const t = await getTranslations({ locale: defaultLocale, namespace: 'dashboard' });
  // Request-type labels are already translated for the public form; reuse them
  // rather than keeping a second copy in the dashboard namespace.
  const tTypes = await getTranslations({ locale: defaultLocale, namespace: 'requests' });

  const [stats, recent] = await Promise.all([
    adminFetchOrLogin<InquiryStats>('/inquiries/stats', token),
    adminFetchOrLogin<Paginated<Inquiry>>('/inquiries?limit=8', token),
  ]);

  const tiles = [
    { label: t('overview.totalLeads'), value: stats?.total ?? 0, emphasis: true },
    { label: t('overview.newLeads'), value: stats?.byStatus?.new ?? 0 },
    { label: t('overview.inProgress'), value: stats?.byStatus?.['in-progress'] ?? 0 },
    { label: t('overview.quoted'), value: stats?.byStatus?.quoted ?? 0 },
    { label: t('overview.closed'), value: stats?.byStatus?.closed ?? 0 },
  ];

  const byType = Object.entries(stats?.byType ?? {});

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">{t('overview.title')}</h1>
      </header>

      <section aria-label={t('overview.title')}>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className={`rounded-2xl border p-5 ${
                tile.emphasis
                  ? 'border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/50'
                  : 'border-[var(--border)] bg-[var(--surface)]'
              }`}
            >
              <dt className="text-xs text-[var(--muted)]">{tile.label}</dt>
              <dd className="mt-1.5 text-2xl font-bold tabular">{tile.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {byType.length > 0 && (
        <section
          aria-label={t('overview.byType')}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <h2 className="text-base font-semibold">{t('overview.byType')}</h2>

          <ul className="mt-4 flex flex-col gap-2.5">
            {byType.map(([type, count]) => (
              <li key={type} className="flex items-center gap-3 text-sm">
                <span className="w-48 shrink-0 truncate">
                  {tTypes.has(`types.${type}`) ? tTypes(`types.${type}`) : type}
                </span>
                <span className="tabular text-[var(--muted)]">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label={t('overview.recent')}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{t('overview.recent')}</h2>
          <Link
            href="/dashboard/leads"
            className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
            {t('overview.viewAll')}
          </Link>
        </div>

        {!recent || recent.items.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] px-6 py-14 text-center">
            <Inbox aria-hidden className="mx-auto size-9 text-[var(--muted)] opacity-50" />
            <p className="mt-3 text-sm text-[var(--muted)]">{t('overview.noLeads')}</p>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {recent.items.map((lead) => (
              <li
                key={lead._id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <span className="font-medium">{lead.name}</span>
                <span className="text-sm text-[var(--muted)]" dir="ltr">
                  {lead.phone}
                </span>
                <LeadStatusBadge status={lead.status} />
                <span className="ms-auto text-xs text-[var(--muted)]">
                  {formatDateTime(lead.createdAt, defaultLocale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
