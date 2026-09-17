import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { MediaCard } from '@/components/dashboard/media-card';
import { MediaUploader } from '@/components/dashboard/media-uploader';
import { Notice } from '@/components/ui/notice';
import { defaultLocale } from '@/i18n/routing';
import { adminFetchOrLogin, requireAdminToken } from '@/lib/admin-auth';
import {
  MEDIA_CATEGORIES,
  type MediaCategory,
  type MediaRecord,
  type Paginated,
} from '@/lib/admin-types';

export const metadata: Metadata = { title: 'معرض الصور والفيديو' };
export const dynamic = 'force-dynamic';

function isCategory(value: string | undefined): value is MediaCategory {
  return Boolean(value) && (MEDIA_CATEGORIES as readonly string[]).includes(value!);
}

export default async function DashboardMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const token = await requireAdminToken();
  const t = await getTranslations({
    locale: defaultLocale,
    namespace: 'dashboard.media',
  });
  const tCategories = await getTranslations({
    locale: defaultLocale,
    namespace: 'gallery.categories',
  });

  const { category } = await searchParams;
  const active = isCategory(category) ? category : undefined;

  /*
   * `/media/admin` rather than the public `/media`: the panel has to list
   * hidden items too, otherwise nothing that was taken off the site could ever
   * be put back.
   */
  const data = await adminFetchOrLogin<Paginated<MediaRecord>>(
    `/media/admin?limit=100${active ? `&category=${active}` : ''}`,
    token,
  );

  const items = data?.items ?? [];
  const hiddenCount = items.filter((item) => !item.isActive).length;

  // Ordering weights only have to sort, not be unique, so deriving the next
  // one from the items on screen is enough even under a category filter.
  const nextOrder = items.reduce((max, item) => Math.max(max, item.order ?? 0), 0) + 1;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t('subtitle')}</p>
      </header>

      <MediaUploader nextOrder={nextOrder} />

      <section aria-label={t('list.title')} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold">{t('list.title')}</h2>
          <p className="text-sm text-[var(--muted)]">
            {t('list.counts', { total: data?.total ?? 0, hidden: hiddenCount })}
          </p>
        </div>

        {/* Plain links rather than a client-side filter: the list is server
            rendered, so a filtered URL is also a shareable one. */}
        <div className="flex flex-wrap gap-2">
          <FilterChip href="/dashboard/media" isActive={!active}>
            {tCategories('all')}
          </FilterChip>

          {MEDIA_CATEGORIES.map((value) => (
            <FilterChip
              key={value}
              href={`/dashboard/media?category=${value}`}
              isActive={active === value}
            >
              {tCategories(value)}
            </FilterChip>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-14 text-center">
            <p className="text-sm text-[var(--muted)]">{t('list.empty')}</p>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <MediaCard key={item._id} item={item} />
            ))}
          </ul>
        )}
      </section>

      <Notice>{t('orderNote')}</Notice>

      <Link
        href={`/${defaultLocale}/gallery`}
        className="self-start text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
      >
        {t('viewPublicGallery')}
      </Link>
    </div>
  );
}

function FilterChip({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        isActive
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-[var(--border)] hover:border-brand-500'
      }`}
    >
      {children}
    </Link>
  );
}
