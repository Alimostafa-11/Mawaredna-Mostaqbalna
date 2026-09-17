import { Clock, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getCalculatorOptions, getSettings } from '@/lib/api';
import { formatHour, localized, telHref, whatsappHref } from '@/lib/utils';
import { InquiryForm } from '@/components/forms/inquiry-form';
import { Notice } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section } from '@/components/ui/section';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const [settings, options] = await Promise.all([getSettings(), getCalculatorOptions()]);

  const address = settings?.address ? localized(settings.address, typedLocale) : '';
  const hasContactDetails = Boolean(
    address || settings?.phones?.length || settings?.email || settings?.whatsapp || settings?.social?.facebook
  );

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold">{t('infoTitle')}</h2>


            {hasContactDetails ? (
              <ul className="mt-6 flex flex-col gap-5">
                {address && (
                  <ContactRow
                    icon={<MapPin aria-hidden className="size-5" />}
                    label={tCommon('address')}
                  >
                    {address}
                  </ContactRow>
                )}

                {settings?.phones?.map((phone) => (
                  <ContactRow
                    key={phone}
                    icon={<Phone aria-hidden className="size-5" />}
                    label={tCommon('callUs')}
                  >
                    <a href={telHref(phone)} className="hover:text-brand-600" dir="ltr">
                      {phone}
                    </a>
                  </ContactRow>
                ))}

                {settings?.whatsapp && (
                  <ContactRow
                    icon={<FaWhatsapp aria-hidden className="size-5" />}
                    label={tCommon('whatsapp')}
                  >
                    <a
                      href={whatsappHref(settings.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-600"
                      dir="ltr"
                    >
                      {settings.whatsapp}
                    </a>
                  </ContactRow>
                )}

                {settings?.email && (
                  <ContactRow
                    icon={<Mail aria-hidden className="size-5" />}
                    label={tCommon('email')}
                  >
                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:text-brand-600"
                      dir="ltr"
                    >
                      {settings.email}
                    </a>
                  </ContactRow>
                )}
                {settings?.social?.facebook && (
                  <ContactRow
                    icon={<FaFacebook aria-hidden className="size-5" />}
                    label={tCommon('facebook')}
                  >
                    <a
                     href={settings.social.facebook}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="hover:text-brand-600"
                     dir="ltr"
                    >
                      {settings?.social?.facebook}
                    </a>
                  </ContactRow>
                )}

                {settings && settings.workingHoursTo > settings.workingHoursFrom && (
                  <ContactRow
                    icon={<Clock aria-hidden className="size-5" />}
                    label={t('workingHours')}
                  >
                    {t('workingHoursValue', {
                      from: formatHour(settings.workingHoursFrom, typedLocale),
                      to: formatHour(settings.workingHoursTo, typedLocale),
                    })}
                  </ContactRow>
                )}
              </ul>
            ) : (
              <div className="mt-6">
                <Notice>{t('pending')}</Notice>
              </div>
            )
            }

            {settings?.location?.mapUrl && (
              <div className="mt-8">
                <h2 className="text-xl font-bold">{t('mapTitle')}</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]">
                  <iframe
                    src="https://www.google.com/maps?q=25.9170804,32.7582415&z=17&output=embed"
                    title={t('mapTitle')}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-72 w-full border-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8">
              <h2 className="text-xl font-bold">{t('formTitle')}</h2>

              <div className="mt-6">
                <InquiryForm
                  governorates={options?.governorates ?? []}
                  source="/contact"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
        {icon}
      </span>
      <div>
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <div className="mt-0.5 text-sm font-medium">{children}</div>
      </div>
    </li>
  );
}
