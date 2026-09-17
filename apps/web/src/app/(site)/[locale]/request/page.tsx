import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getCalculatorOptions } from '@/lib/api';
import { InquiryForm } from '@/components/forms/inquiry-form';
import { PageHero } from '@/components/ui/page-hero';
import { Section } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'requests' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function RequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: 'requests' });

  // The governorate list is served alongside the calculator options, so the
  // served-areas list is maintained in one place.
  const options = await getCalculatorOptions();

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8">
          <h2 className="text-xl font-bold">{t('formTitle')}</h2>

          <div className="mt-6">
            <InquiryForm
              governorates={options?.governorates ?? []}
              source="/request"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
