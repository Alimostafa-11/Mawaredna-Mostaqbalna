import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LeadFilters } from '@/components/dashboard/lead-filters';
import { LeadRow } from '@/components/dashboard/lead-row';
import { defaultLocale } from '@/i18n/routing';
import { adminFetchOrLogin, requireAdminToken } from '@/lib/admin-auth';
import type { Inquiry, Paginated } from '@/lib/admin-types';

export const metadata: Metadata = { title: 'الطلبات' };
export const dynamic = 'force-dynamic';

interface LeadsPageProps {
  searchParams: Promise<{ status?: string; type?: string; q?: string; page?: string }>;
}

export default async function DashboardLeadsPage({ searchParams }: LeadsPageProps) {
  const token = await requireAdminToken();
  const params = await searchParams;

  const t = await getTranslations({ locale: defaultLocale, namespace: 'dashboard' });

  // Filters live in the URL rather than component state, so a filtered view is
  // shareable and survives a refresh after editing a lead.
  const query = new URLSearchParams({ limit: '50' });
  if (params.status) query.set('status', params.status);
  if (params.type) query.set('type', params.type);
  if (params.q) query.set('q', params.q);
  if (params.page) query.set('page', params.page);

  const leads = await adminFetchOrLogin<Paginated<Inquiry>>(
    `/inquiries?${query.toString()}`,
    token,
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">{t('leads.title')}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t('leads.subtitle')}</p>
      </header>

      <LeadFilters
        status={params.status ?? ''}
        type={params.type ?? ''}
        q={params.q ?? ''}
      />

      {!leads || leads.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
          <p className="text-sm text-[var(--muted)]">{t('leads.empty')}</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[var(--muted)]">
            {t('leads.showing', { count: leads.items.length, total: leads.total })}
          </p>

          <ul className="flex flex-col gap-3">
            {leads.items.map((lead) => (
              <LeadRow key={lead._id} lead={lead} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
