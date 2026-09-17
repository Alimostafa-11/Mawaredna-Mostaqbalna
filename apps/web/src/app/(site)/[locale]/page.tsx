import { ArrowLeft, ArrowRight, Calculator, Leaf, Phone } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getProducts, getServices, getSettings } from '@/lib/api';
import { localized } from '@/lib/utils';
import { ProcessChain } from '@/components/ui/process-chain';
import { Section, SectionHeading } from '@/components/ui/section';
import { ServiceIcon } from '@/components/ui/service-icon';
import Image from 'next/image';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'home' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tCompost = await getTranslations({ locale, namespace: 'compost' });

  const [settings, services, products] = await Promise.all([
    getSettings(),
    getServices(),
    getProducts(),
  ]);

  const compost = products[0] ?? null;
  const Arrow = typedLocale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Hero */}


      <div className="relative overflow-hidden mt-5 border-b border-[var(--border)]">
  {/* Background Image */}
   <Image
    src="/home-logo.jpeg"
    alt={t('heroImageAlt')}
    fill
    priority
    sizes="100vw"
    className="scale-110 object-cover blur-[1px]"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Content */}
  <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-300 bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-brand-700 dark:border-brand-800 dark:text-brand-300">
        <Leaf aria-hidden className="size-3.5" />

        {settings?.slogan
          ? localized(settings.slogan, typedLocale)
          : t('heroTitle')}
      </span>

      <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-balance text-white sm:text-3xl lg:text-4xl">
        {t('heroTitle')}
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-white/90">
        {t('heroSubtitle')}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/compost"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {t('heroPrimaryCta')}
          <Arrow aria-hidden className="size-4" />
        </Link>

        <Link
          href="/request"
          className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          {t('heroSecondaryCta')}
        </Link>
      </div>
    </div>
  </div>
</div>

      {/* Company introduction */}
      {settings?.about && (
        <Section>
          <SectionHeading title={t('introTitle')} />
          <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
            {localized(settings.about, typedLocale)}
          </p>
          <div className="mt-8 text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              {tCommon('learnMore')}
              <Arrow aria-hidden className="size-4" />
            </Link>
          </div>
        </Section>
      )}

      {/* Lines of work */}
      {services.length > 0 && (
        <Section tone="muted">
          <SectionHeading title={t('servicesTitle')} subtitle={t('servicesSubtitle')} />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <li
                key={service._id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-500"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  <ServiceIcon name={service.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">
                  {localized(service.title, typedLocale)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                  {localized(service.description, typedLocale)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              {tCommon('learnMore')}
              <Arrow aria-hidden className="size-4" />
            </Link>
          </div>
        </Section>
      )}

      {/* Compost highlight */}
      {compost && (
        <Section>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                title={t('productTitle')}
                subtitle={localized(compost.summary, typedLocale)}
                align="start"
              />

              <Link
                href="/compost"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {tCompost('orderCta')}
                <Arrow aria-hidden className="size-4" />
              </Link>
            </div>

            {compost.specifications.length > 0 && (
              <dl className="grid gap-4 sm:grid-cols-2">
                {compost.specifications.map((spec) => (
                  <div
                    key={spec.label.ar}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
                  >
                    <dt className="text-xs text-[var(--muted)]">
                      {localized(spec.label, typedLocale)}
                    </dt>
                    <dd className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-xl font-bold tabular" dir="ltr">
                        {spec.value}
                      </span>
                      {spec.unit && (
                        <span className="text-sm text-[var(--muted)]" dir="ltr">
                          {spec.unit}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Section>
      )}

      {/* Waste-to-product chain */}
      <Section tone="muted">
        <SectionHeading title={t('processTitle')} subtitle={t('processSubtitle')} />
        <div className="mt-12">
          <ProcessChain />
        </div>
      </Section>

      {/* Farm calculator teaser */}
      <Section>
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-brand-200 bg-brand-50 px-6 py-12 text-center dark:border-brand-800 dark:bg-brand-950/40 lg:px-12">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Calculator aria-hidden className="size-7" />
          </span>

          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-balance lg:text-3xl">
              {t('calculatorTitle')}
            </h2>
            <p className="mt-3 text-base text-pretty text-[var(--muted)]">
              {t('calculatorSubtitle')}
            </p>
          </div>

          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {t('calculatorCta')}
            <Arrow aria-hidden className="size-4" />
          </Link>
        </div>
      </Section>

      {/* Closing call to action */}
      <Section tone="muted">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading title={t('ctaTitle')} subtitle={t('ctaSubtitle')} />

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/request"
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {tCommon('requestService')}
            </Link>

            {settings?.phones?.[0] ? (
              <a
                href={`tel:${settings.phones[0].replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-semibold transition-colors hover:border-brand-500"
              >
                <Phone aria-hidden className="size-4" />
                {tCommon('callUs')}
              </a>
            ) : (
              <Link
                href="/contact"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-semibold transition-colors hover:border-brand-500"
              >
                {tCommon('contactUs')}
              </Link>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
