import { Leaf, Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { ABOUT_LINKS, CONTACT_LINKS, SERVICES_LINKS} from '@/lib/navigation-items';
import type { SiteSettings, SocialLinks } from '@/lib/types';
import { localized, telHref } from '@/lib/utils';
import {
  SOCIAL_LABELS,
  SOCIAL_NETWORKS,
  SocialIcon,
} from '@/components/ui/social-icon';
import { FaFacebook } from 'react-icons/fa';

interface SiteFooterProps {
  locale: Locale;
  settings: SiteSettings | null;
}

export async function SiteFooter({ locale, settings }: SiteFooterProps) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });

  const companyName = settings
    ? localized(settings.companyName, locale)
    : tMeta('siteName');

  const address = settings?.address ? localized(settings.address, locale) : '';
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--surface-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white"
              >
                <img
                  src="/company-logo.jpeg"
                  alt={companyName}
                  width={44}
                  height={44}
                  className="size-10 rounded-lg object-contain lg:size-11"

                />
              </span>
              <span className="text-lg font-bold">{companyName}</span>
            </div>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)]">
              {settings?.about
                ? localized(settings.about, locale)
                : tMeta('description')}
            </p>

            {/* Only the networks the company actually has a presence on. */}
            {settings && (
              <div className="mt-5 flex flex-wrap gap-3">
                {SOCIAL_NETWORKS.map((network) => {
                  const href = settings.social?.[network as keyof SocialLinks];
                  if (!href) return null;

                  // return (
                  //   <a
                  //     key={network}
                  //     href={href}
                  //     target="_blank"
                  //     rel="noopener noreferrer"
                  //     aria-label={SOCIAL_LABELS[network]}
                  //     className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-brand-600 hover:text-brand-600"
                  //   >
                  //     <SocialIcon network={network} />
                  //   </a>
                  // );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-md font-semibold uppercase tracking-wide">
              {t('About The Company')}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {ABOUT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-brand-600"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-md font-semibold uppercase tracking-wide">
              {t('Our Services')}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SERVICES_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-brand-600"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h2 className="text-md font-semibold uppercase tracking-wide">
              {t('contact')}
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--muted)]">
                 {CONTACT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-brand-600"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <span>{address}</span>
                </li>
              )}

              {settings?.phones?.map((phone) => (
                <li key={phone} className="flex items-center gap-2">
                  <Phone aria-hidden className="size-4 shrink-0" />
                  <a href={telHref(phone)} className="hover:text-brand-600" dir="ltr">
                    {phone}
                  </a>
                </li>
              ))}

              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail aria-hidden className="size-4 shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-brand-600"
                    dir="ltr"
                  >
                    {settings.email}
                  </a>
                </li>
              )}

                {settings?.social?.facebook && (
                    <li className="flex items-center gap-2">
                     <FaFacebook aria-hidden className="size-4 shrink-0" />
                      <a
                        href={settings.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                       className="hover:text-brand-600"
                       dir="ltr"
                       >
                     {settings?.social?.facebook}
                   </a>
              </li>
            )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {companyName} — {t('rights')}
          </p>

          {/* Registration numbers appear only once they have been verified. */}
          {(settings?.commercialRegisterNo || settings?.taxCardNo) && (
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              {settings.commercialRegisterNo && (
                <span>
                  {t('commercialRegister')}: {settings.commercialRegisterNo}
                </span>
              )}
              {settings.taxCardNo && (
                <span>
                  {t('taxCard')}: {settings.taxCardNo}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
