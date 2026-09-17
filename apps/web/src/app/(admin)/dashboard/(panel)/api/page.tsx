import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ApiExplorer } from '@/components/dashboard/api-explorer';
import { Notice } from '@/components/ui/notice';
import { defaultLocale } from '@/i18n/routing';
import { requireAdminToken } from '@/lib/admin-auth';

export const metadata: Metadata = { title: 'استعراض الـ API' };
export const dynamic = 'force-dynamic';

export default async function DashboardApiPage() {
  // Not strictly needed — the proxy enforces auth on every call — but it keeps
  // an unauthenticated visitor from seeing the endpoint inventory.
  await requireAdminToken();

  const t = await getTranslations({ locale: defaultLocale, namespace: 'dashboard' });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">{t('api.title')}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t('api.subtitle')}</p>
      </header>

      <Notice>{t('api.protectedNote')}</Notice>
      <ApiExplorer />
    </div>
  );
}
