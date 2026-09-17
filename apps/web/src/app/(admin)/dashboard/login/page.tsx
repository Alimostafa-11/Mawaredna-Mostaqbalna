import { Leaf } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/dashboard/login-form';
import { getAdminToken } from '@/lib/admin-auth';
import { defaultLocale } from '@/i18n/routing';

export const metadata: Metadata = { title: 'تسجيل الدخول' };

// A session cookie makes this page's answer user-specific, so it must not be
// prerendered.
export const dynamic = 'force-dynamic';

export default async function DashboardLoginPage() {
  // Already signed in? Skip the form.
  if (await getAdminToken()) {
    redirect('/dashboard');
  }

  const t = await getTranslations({ locale: defaultLocale, namespace: 'dashboard' });

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Leaf aria-hidden className="size-7" />
          </span>
          <h1 className="text-2xl font-bold">{t('loginTitle')}</h1>
          <p className="text-sm text-[var(--muted)]">{t('loginSubtitle')}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-brand-600">
            {t('backToSite')}
          </Link>
        </p>
      </div>
    </main>
  );
}
