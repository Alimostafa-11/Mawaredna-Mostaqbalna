import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { SignOutButton } from '@/components/dashboard/sign-out-button';
import { defaultLocale } from '@/i18n/routing';
import { adminFetchOrLogin, requireAdminToken, type AdminUser } from '@/lib/admin-auth';

/**
 * Shell for every signed-in dashboard page.
 *
 * `requireAdminToken` redirects to the login page when the cookie is missing,
 * so each page below can assume a session. The token is also verified against
 * the API here (via `/auth/me`), which catches an expired or revoked one
 * rather than letting every child page fail separately.
 */
export default async function DashboardPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await requireAdminToken();
  const user = await adminFetchOrLogin<AdminUser>('/auth/me', token);

  const t = await getTranslations({ locale: defaultLocale, namespace: 'dashboard' });

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="border-b border-[var(--border)] bg-[var(--surface)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-e">
        <div className="flex h-full flex-col gap-6 p-5">
          <div>
            <p className="text-lg font-bold">{t('title')}</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{t('subtitle')}</p>
          </div>

          <DashboardNav />

          <div className="mt-auto flex flex-col gap-3 border-t border-[var(--border)] pt-4">
            {user && (
              <p className="text-xs text-[var(--muted)]">
                {t('signedInAs')}
                <br />
                <span className="font-medium text-[var(--foreground)]" dir="ltr">
                  {user.email}
                </span>
              </p>
            )}

            <SignOutButton />

            {/* Crosses into the site's own root layout, so Next does a full
                navigation here rather than a client transition. */}
            <Link
              href="/"
              className="text-xs text-[var(--muted)] transition-colors hover:text-brand-600"
            >
              {t('backToSite')}
            </Link>
          </div>
        </div>
      </aside>

      <main id="dashboard-content" className="min-w-0 flex-1 p-5 lg:p-8">
        {children}
      </main>
    </div>
  );
}
