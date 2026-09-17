import { Compass, Target } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getSettings } from '@/lib/api';
import { localized } from '@/lib/utils';
import { Notice } from '@/components/ui/notice';
import { PageHero } from '@/components/ui/page-hero';
import { Section, SectionHeading } from '@/components/ui/section';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'about' });
  const settings = await getSettings();

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />



       {/* About */}
      <Section className="max-w-7xl mx-auto">
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-colors hover:border-brand-500">
    <h2 className="text-xl font-bold">
      {t('aboutTitle')}
    </h2>

    <p className="mt-5 text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
      {t('description')}
    </p>
  </div>
</Section>


       {/* vision */}
      <Section className="max-w-7xl mt-[-100px] mx-auto">
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-colors hover:border-brand-500">
    <div className="flex items-center gap-4">

      <h2 className="text-xl font-bold">
        {t('visionTitle')}
      </h2>
    </div>

    <p className="mt-5 text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
      {t('vision')}
    </p>
  </div>
</Section>


       {/* mission */}
      <Section className="max-w-7xl mt-[-100px] mx-auto">
 <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-colors hover:border-brand-500">
    <div className="flex items-center gap-4">
    <h2 className=" text-xl font-bold">
      {t('missionTitle')}
    </h2>
</div>
    <p className="mt-5 text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
      {t('mission')}
    </p>
  </div>
</Section>


       {/* goals */}
      <Section className="max-w-7xl mt-[-100px] mx-auto">
  <h2 className="mb-8 text-xl font-bold">
    {t('goalsTitle')}
  </h2>

  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {(t.raw('goals') as string[]).map((goal, index) => (
      <li
        key={index}
        className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-500"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          {index + 1}
        </span>

        <p className="text-sm leading-relaxed text-[var(--muted)] lg:text-base">
          {goal}
        </p>
      </li>
    ))}
  </ul>
</Section>
    </>
  );
}
