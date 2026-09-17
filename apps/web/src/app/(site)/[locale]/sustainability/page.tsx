import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Notice } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section, SectionHeading } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sustainability' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: 'sustainability' });

  const loop = [t('loop1'), t('loop2'), t('loop3'), t('loop4'), t('loop5')];

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <p className="mx-auto max-w-3xl text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
          {t('body')}
        </p>
      </Section>

      <Section tone="muted">
        <SectionHeading title={t('loopTitle')} />

        {/*
          An ordered list rather than a drawn circle: the sequence is the point,
          and a list stays readable at phone width and in both directions.
        */}
        <ol className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {loop.map((step, index) => (
            <li
              key={step}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white tabular">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <Notice>{t('claimsNote')}</Notice>
        </div>
      </Section>
    </>
  );
}
