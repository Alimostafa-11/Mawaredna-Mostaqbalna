import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getCalculatorOptions } from '@/lib/api';
import { CalculatorForm } from '@/components/forms/calculator-form';
import { EmptyState } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'calculator' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: 'calculator' });
  const tErrors = await getTranslations({ locale, namespace: 'errors' });

  // Crop and soil tables come from the API so the agronomic assumptions stay
  // editable without a frontend deploy.
  const options = await getCalculatorOptions();

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        {options ? (
          <CalculatorForm options={options} />
        ) : (
          <EmptyState message={tErrors('contentUnavailable')} />
        )}
      </Section>
    </>
  );
}
