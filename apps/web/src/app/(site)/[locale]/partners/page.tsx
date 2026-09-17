import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import type { Locale } from '@/i18n/routing';
import { getPartners } from '@/lib/api';
import { localized } from '@/lib/utils';
import { EmptyState, Notice } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'partners' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'partners' });

  // The API already filters to approved entries; nothing unapproved reaches
  // the page even if a draft record exists.
  const partners = await getPartners();

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        {partners.length === 0 ? (
          <EmptyState message={t('empty')} />
        ) : (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => {
              const name = localized(partner.name, typedLocale);

              const content = (
                <>
                  {partner.logoUrl ? (
                    <div className="relative h-16 w-full">
                      <Image
                        src={partner.logoUrl}
                        alt={name}
                        fill
                        sizes="200px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-medium">{name}</span>
                  )}
                </>
              );

              return (
                <li
                  key={partner._id}
                  className="flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-500"
                >
                  {partner.websiteUrl ? (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex w-full items-center justify-center"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mx-auto mt-12 max-w-3xl">
          <Notice>{t('consentNote')}</Notice>
        </div>
      </Section>
    </>
  );
}
