import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getMedia } from '@/lib/api';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import { EmptyState } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: 'gallery' });
  const items = await getMedia();

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        {items.length === 0 ? (
          <EmptyState message={t('empty')} />
        ) : (
          <GalleryGrid items={items} />
        )}
      </Section>
    </>
  );
}
