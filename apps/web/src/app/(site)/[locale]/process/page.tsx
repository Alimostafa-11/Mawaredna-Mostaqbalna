import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import type { Locale } from '@/i18n/routing';
import { getMedia } from '@/lib/api';
import { localized } from '@/lib/utils';
import { PageHero } from '@/components/ui/page-hero';
import { ProcessChain } from '@/components/ui/process-chain';
import { Section, SectionHeading } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'process' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'process' });
  const tGallery = await getTranslations({ locale, namespace: 'gallery' });

  // Real footage of turning and windrow work illustrates the chain when the
  // team has uploaded it; the page reads fine without it.
  const [turning, windrows] = await Promise.all([
    getMedia('turning'),
    getMedia('compost-windrows'),
  ]);

  const footage = [...windrows, ...turning].slice(0, 6);

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <ProcessChain />
      </Section>

      {footage.length > 0 && (
        <Section tone="muted">
          <SectionHeading title={tGallery('title')} />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {footage.map((item) => (
              <li
                key={item._id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="relative aspect-4/3">
                  {item.kind === 'video' ? (
                    <video
                      src={item.url}
                      poster={item.thumbnailUrl || undefined}
                      controls
                      preload="none"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={localized(item.title, typedLocale)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>

                <p className="p-4 text-sm">{localized(item.title, typedLocale)}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
