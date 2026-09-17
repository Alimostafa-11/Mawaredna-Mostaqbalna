import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/page-hero';
import { Section, SectionHeading } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sugarcane' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function SugarcanePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: 'sugarcane' });
  const steps = [t('step1'), t('step2'), t('step3'), t('step4')];

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">{t('introTitle')}</h2>
          <p className="mt-4 text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
            {t('introBody')}
          </p>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading title={t('stepsTitle')} />

        <ol className="mx-auto mt-10 flex max-w-3xl flex-col gap-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white tabular">
                {index + 1}
              </span>
              <p className="leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link
            href="/request"
            className="inline-flex rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {t('cta')}
          </Link>
        </div>
      </Section>
    </>
  );
}
