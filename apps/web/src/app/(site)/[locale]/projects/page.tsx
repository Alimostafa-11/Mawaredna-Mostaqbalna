import { MapPin, Package, Scale } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import type { Locale } from '@/i18n/routing';
import { getProjects } from '@/lib/api';
import { formatNumber, localized } from '@/lib/utils';
import { EmptyState } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'projects' });
  const projects = await getProjects();

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <Section>
        {projects.length === 0 ? (
          <EmptyState message={t('empty')} />
        ) : (
          <ul className="flex flex-col gap-8">
            {projects.map((project) => (
              <li
                key={project._id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="grid gap-0 lg:grid-cols-3">
                  {project.images[0] && (
                    <div className="relative aspect-video lg:aspect-auto">
                      <Image
                        src={project.images[0]}
                        alt={localized(project.name, typedLocale)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className={project.images[0] ? 'p-7 lg:col-span-2' : 'p-7 lg:col-span-3'}>
                    <h2 className="text-xl font-bold">
                      {localized(project.name, typedLocale)}
                    </h2>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                      <Fact
                        icon={<MapPin aria-hidden className="size-4" />}
                        label={t('location')}
                        value={localized(project.location, typedLocale)}
                      />
                      <Fact
                        icon={<Package aria-hidden className="size-4" />}
                        label={t('wasteType')}
                        value={localized(project.wasteType, typedLocale)}
                      />
                      {project.wasteVolume !== undefined && (
                        <Fact
                          icon={<Scale aria-hidden className="size-4" />}
                          label={t('wasteVolume')}
                          value={`${formatNumber(project.wasteVolume, typedLocale)} ${project.wasteVolumeUnit}`}
                        />
                      )}
                    </dl>

                    {project.stages.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold">{t('stages')}</h3>
                        <ol className="mt-2.5 flex flex-wrap gap-2">
                          {project.stages.map((stage) => (
                            <li
                              key={stage.ar}
                              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
                            >
                              {localized(stage, typedLocale)}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {project.finalProduct && (
                      <p className="mt-5 text-sm text-[var(--muted)]">
                        <span className="font-semibold">{t('finalProduct')}: </span>
                        {localized(project.finalProduct, typedLocale)}
                      </p>
                    )}

                    {/*
                      Partner names appear only where written consent is on
                      file, per the brief.
                    */}
                    {project.arePartnersApproved && project.partners.length > 0 && (
                      <p className="mt-2.5 text-sm text-[var(--muted)]">
                        <span className="font-semibold">{t('partners')}: </span>
                        {project.partners
                          .map((partner) => localized(partner, typedLocale))
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
