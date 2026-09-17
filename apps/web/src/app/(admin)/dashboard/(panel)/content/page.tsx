import { ExternalLink, Images } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { defaultLocale } from '@/i18n/routing';
import { adminFetchOrLogin, requireAdminToken } from '@/lib/admin-auth';
import type { Paginated, PartnerRecord } from '@/lib/admin-types';
import { Notice } from '@/components/ui/notice';

export const metadata: Metadata = { title: 'المحتوى' };
export const dynamic = 'force-dynamic';

interface CountOnly {
  total: number;
}

export default async function DashboardContentPage() {
  const token = await requireAdminToken();
  const t = await getTranslations({ locale: defaultLocale, namespace: 'dashboard' });

  /*
   * The public list endpoints already apply the publication filters
   * (`isActive`, `isApproved`), so comparing a public count against the raw
   * collection count is exactly the "published vs awaiting approval" split
   * the team needs to see.
   */
  const [services, products, projects, media, publicPartners, allPartners] =
    await Promise.all([
      adminFetchOrLogin<CountOnly>('/services?limit=1', token),
      adminFetchOrLogin<CountOnly>('/products?limit=1', token),
      adminFetchOrLogin<CountOnly>('/projects?limit=1', token),
      adminFetchOrLogin<CountOnly>('/media?limit=1', token),
      adminFetchOrLogin<CountOnly>('/partners?limit=1', token),
      adminFetchOrLogin<Paginated<PartnerRecord>>('/partners?limit=100', token),
    ]);

  // `/partners` hides unapproved records, so the approved count is what the
  // public endpoint returns and there is no admin-side total to compare with
  // yet; show the approved figure and flag the gate in the note below.
  const approvedPartners = publicPartners?.total ?? 0;
  const listedPartners = allPartners?.items.length ?? 0;

  const rows = [
    { label: t('content.services'), published: services?.total ?? 0 },
    { label: t('content.products'), published: products?.total ?? 0 },
    { label: t('content.projects'), published: projects?.total ?? 0 },
    { label: t('content.media'), published: media?.total ?? 0 },
    {
      label: t('content.partners'),
      published: approvedPartners,
      pending: Math.max(0, listedPartners - approvedPartners),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">{t('content.title')}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t('content.subtitle')}</p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-start text-xs text-[var(--muted)]">
              <th scope="col" className="p-4 text-start font-medium">
                {t('content.collection')}
              </th>
              <th scope="col" className="p-4 text-start font-medium">
                {t('content.published')}
              </th>
              <th scope="col" className="p-4 text-start font-medium">
                {t('content.pending')}
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[var(--border)] last:border-b-0">
                <th scope="row" className="p-4 text-start font-medium">
                  {row.label}
                </th>
                <td className="p-4 tabular">{row.published}</td>
                <td className="p-4 tabular text-[var(--muted)]">
                  {row.pending ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Notice>{t('content.approvalNote')}</Notice>
      <Notice>{t('content.editNote')}</Notice>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/media"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Images aria-hidden className="size-4" />
          {t('nav.media')}
        </Link>

        <Link
          href="/dashboard/api"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brand-500"
        >
          <ExternalLink aria-hidden className="size-4" />
          {t('content.openApi')}
        </Link>
      </div>
    </div>
  );
}
