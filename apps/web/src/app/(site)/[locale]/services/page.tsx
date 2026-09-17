import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getServices } from '@/lib/api';
import { localized } from '@/lib/utils';
import { EmptyState, Notice } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section } from '@/components/ui/section';
import { ServiceIcon } from '@/components/ui/service-icon';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'services' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const services = await getServices();

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />




      <Section>
        <h2 className="text-xl mb-10 font-bold">
         {t('businessAreasTitle')}
        </h2>
  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {(t.raw('businessAreas') as Array<{
      title: string;
      description: string;
    }>).map((service, index) => (
      <li
        key={index}
        className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-500"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <ServiceIcon name={['compost', 'truck', 'support', 'truck', 'recycle', 'leaf'][index]} />
        </span>

        <h2 className="mt-5 text-lg font-semibold">
          {service.title}
        </h2>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--muted)]">
          {service.description}
        </p>

      </li>
    ))}
  </ul>

</Section>


{/* خدمات */}
      <Section className="mt-[-80px]">
        <h2 className="text-xl mb-10 font-bold">
         {t('servicesTitle')}
        </h2>
  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {(t.raw('services') as Array<{
      title: string;
      description: string;
    }>).map((service, index) => (
      <li
        key={index}
        className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-500"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <ServiceIcon name={['compost', 'truck', 'support', 'truck', 'recycle', 'leaf'][index]} />
        </span>

        <h2 className="mt-5 text-lg font-semibold">
          {service.title}
        </h2>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--muted)]">
          {service.description}
        </p>

      </li>
    ))}
  </ul>

</Section>
    </>
  );
}
