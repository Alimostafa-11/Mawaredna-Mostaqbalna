// import { FileText, Package } from 'lucide-react';
// import type { Metadata } from 'next';
// import { getTranslations, setRequestLocale } from 'next-intl/server';
// import Image from 'next/image';
// import { Link } from '@/i18n/navigation';
// import type { Locale } from '@/i18n/routing';
// import { getProducts } from '@/lib/api';
// import { localized } from '@/lib/utils';
// import { EmptyState, Notice } from '@/components/ui/notice';
// import { PageHero } from '@/components/ui/page-hero';
// import { Section, SectionHeading } from '@/components/ui/section';

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const t = await getTranslations({ locale, namespace: 'compost' });

//   return { title: t('title') };
// }

// export default async function CompostPage({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   setRequestLocale(locale as Locale);

//   const typedLocale = locale as Locale;
//   const t = await getTranslations({ locale, namespace: 'compost' });
//   const tCommon = await getTranslations({ locale, namespace: 'common' });

//   const products = await getProducts();
//   const product = products[0] ?? null;

//   if (!product) {
//     return (
//       <>
//         <PageHero title={t('title')} />
//         <Section>
//           <EmptyState message={tCommon('noResults')} />
//         </Section>
//       </>
//     );
//   }

//   return (
//     <>
//       <PageHero
//         title={localized(product.name, typedLocale)}
//         subtitle={localized(product.summary, typedLocale)}
//       >
//         <Link
//           href="/request"
//           className="inline-flex rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
//         >
//           {t('orderCta')}
//         </Link>
//       </PageHero>

//       {product.description && (
//         <Section>
//           <p className="mx-auto max-w-3xl text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
//             {localized(product.description, typedLocale)}
//           </p>
//         </Section>
//       )}

//       {/* Technical specifications */}
//       {product.specifications.length > 0 && (
//         <Section tone="muted">
//           <SectionHeading title={t('specifications')} />

//           <dl className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {product.specifications.map((spec) => (
//               <div
//                 key={spec.label.ar}
//                 className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center"
//               >
//                 <dt className="text-xs text-[var(--muted)]">
//                   {localized(spec.label, typedLocale)}
//                 </dt>
//                 <dd className="mt-2 flex items-baseline justify-center gap-1.5">
//                   <span className="text-2xl font-bold tabular" dir="ltr">
//                     {spec.value}
//                   </span>
//                   {spec.unit && (
//                     <span className="text-sm text-[var(--muted)]" dir="ltr">
//                       {spec.unit}
//                     </span>
//                   )}
//                 </dd>
//               </div>
//             ))}
//           </dl>

//           <div className="mx-auto mt-8 max-w-3xl">
//             <Notice>{t('specsNote')}</Notice>
//           </div>
//         </Section>
//       )}

//       {/* Raw materials */}
//       {product.rawMaterials.length > 0 && (
//         <Section>
//           <SectionHeading title={t('rawMaterials')} align="start" />

//           <ul className="mt-8 flex flex-wrap gap-3">
//             {product.rawMaterials.map((material) => (
//               <li
//                 key={material.ar}
//                 className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm"
//               >
//                 {localized(material, typedLocale)}
//               </li>
//             ))}
//           </ul>
//         </Section>
//       )}

//       {/* Production stages */}
//       {product.productionStages.length > 0 && (
//         <Section tone="muted">
//           <SectionHeading title={t('stages')} />

//           <ol className="mx-auto mt-10 flex max-w-3xl flex-col gap-4">
//             {product.productionStages.map((stage, index) => (
//               <li
//                 key={stage.title.ar}
//                 className="flex gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
//               >
//                 <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white tabular">
//                   {index + 1}
//                 </span>

//                 <div>
//                   <h3 className="font-semibold">
//                     {localized(stage.title, typedLocale)}
//                   </h3>
//                   {stage.description && (
//                     <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
//                       {localized(stage.description, typedLocale)}
//                     </p>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ol>
//         </Section>
//       )}

//       {/* Usage guidance */}
//       {product.usageInstructions.length > 0 && (
//         <Section>
//           <SectionHeading title={t('usage')} align="start" />

//           <ul className="mt-8 flex max-w-3xl flex-col gap-3">
//             {product.usageInstructions.map((instruction) => (
//               <li
//                 key={instruction.ar}
//                 className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed"
//               >
//                 <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />
//                 {localized(instruction, typedLocale)}
//               </li>
//             ))}
//           </ul>
//         </Section>
//       )}

//       {/* Product photography */}
//       {product.images.length > 0 && (
//         <Section tone="muted">
//           <SectionHeading title={t('images')} />

//           <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {product.images.map((image) => (
//               <li
//                 key={image}
//                 className="relative aspect-4/3 overflow-hidden rounded-2xl border border-[var(--border)]"
//               >
//                 <Image
//                   src={image}
//                   alt={localized(product.name, typedLocale)}
//                   fill
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                   className="object-cover"
//                 />
//               </li>
//             ))}
//           </ul>
//         </Section>
//       )}

//       {/* Laboratory analyses */}
//       <Section>
//         <SectionHeading title={t('labResults')} align="start" />

//         {product.labResults.length === 0 ? (
//           <div className="mt-8 max-w-3xl">
//             <Notice>{t('labResultsPending')}</Notice>
//           </div>
//         ) : (
//           <ul className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
//             {product.labResults.map((report) => (
//               <li
//                 key={report.fileUrl}
//                 className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
//               >
//                 <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
//                   <FileText aria-hidden className="size-5" />
//                 </span>

//                 <div className="min-w-0">
//                   <h3 className="font-medium">{localized(report.title, typedLocale)}</h3>
//                   {report.laboratory && (
//                     <p className="mt-1 text-sm text-[var(--muted)]">
//                       {localized(report.laboratory, typedLocale)}
//                     </p>
//                   )}
//                   <a
//                     href={report.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
//                   >
//                     {t('viewReport')}
//                   </a>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </Section>

//       {/* Packaging and supply */}
//       {product.packaging && (
//         <Section tone="muted">
//           <div className="mx-auto flex max-w-3xl gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
//             <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
//               <Package aria-hidden className="size-6" />
//             </span>

//             <div>
//               <h2 className="text-lg font-bold">{t('packaging')}</h2>
//               <p className="mt-2 leading-relaxed text-[var(--muted)]">
//                 {localized(product.packaging, typedLocale)}
//               </p>

//               <Link
//                 href="/request"
//                 className="mt-5 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
//               >
//                 {t('orderCta')}
//               </Link>
//             </div>
//           </div>
//         </Section>
//       )}
//     </>
//   );
// }
import { CheckCircle2, Droplets, Leaf, Package, Sprout } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
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
  const t = await getTranslations({
    locale,
    namespace: 'compost',
  });

  return {
    title: t('title'),
  };
}

export default async function CompostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale as Locale);

  const t = await getTranslations({
    locale,
    namespace: 'compost',
  });

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
      >
        <Link
          href="/request"
          className="inline-flex rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {t('orderCta')}
        </Link>
      </PageHero>

      {/* Product description */}
      {/* <Section className="max-w-7xl mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="rounded-2xl max-w-7xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <Leaf aria-hidden className="size-6" />
              </span>

              <h2 className="text-xl font-bold">
                {t('aboutTitle')}
              </h2>
            </div>

            <p className="mt-5 text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
              {t('description')}
            </p>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image
              src="/images/compost.jpg"
              alt={t('imageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section> */}
      <Section className="w-full">
  <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8  hover:border-brand-500">
    <div className="flex items-center gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
        <Leaf aria-hidden className="size-6" />
      </span>

      <h2 className="text-xl font-bold">
        {t('aboutTitle')}
      </h2>
    </div>

    <p className="mt-5 text-base leading-loose text-pretty text-[var(--muted)] lg:text-lg">
      {t('description')}
    </p>
  </div>
</Section>

      {/* General specifications */}
      <Section tone="muted">
        <SectionHeading title={t('specificationsTitle')} />

        <div className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(t.raw('specifications') as Array<{
            title: string;
            value: string;
            description: string;
          }>).map((spec) => (
            <div
              key={spec.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center transition-colors hover:border-brand-500"
            >
              <h3 className="text-sm font-semibold text-[var(--muted)]">
                {spec.title}
              </h3>

              <p className="mt-3 text-2xl font-bold text-brand-700 dark:text-brand-300">
                {spec.value}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {spec.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Components */}
      <Section>
        <SectionHeading title={t('componentsTitle')} />

        <div className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(t.raw('components') as Array<{
            title: string;
            description: string;
          }>).map((component) => (
            <div
              key={component.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-500"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <Leaf aria-hidden className="size-6" />
              </span>

              <h3 className="mt-5 font-semibold">
                {component.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {component.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Nutritional composition */}
      <Section tone="muted">
        <SectionHeading title={t('nutrientsTitle')} />

        <div className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(t.raw('nutrients') as Array<{
            title: string;
            value: string;
            symbol: string;
          }>).map((nutrient) => (
            <div
              key={nutrient.title}
              className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6  hover:border-brand-500"
            >
              <div>
                <h3 className="font-semibold">
                  {nutrient.title}
                </h3>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {nutrient.symbol}
                </p>
              </div>

              <span className="text-xl font-bold text-brand-700 dark:text-brand-300">
                {nutrient.value}
              </span>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-4xl text-center text-sm leading-relaxed text-[var(--muted)]">
          {t('nutrientsNote')}
        </p>
      </Section>

      {/* Benefits */}
      <Section>
        <SectionHeading title={t('benefitsTitle')} />

        <ul className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(t.raw('benefits') as string[]).map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-brand-500"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {index === 0 && (
                  <Leaf aria-hidden className="size-5" />
                )}

                {index === 1 && (
                  <Sprout aria-hidden className="size-5" />
                )}

                {index === 2 && (
                  <Droplets aria-hidden className="size-5" />
                )}

                {index > 2 && (
                  <CheckCircle2 aria-hidden className="size-5" />
                )}
              </span>

              <p className="text-sm leading-relaxed text-[var(--muted)] lg:text-base">
                {benefit}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Raw materials */}
      <Section tone="muted">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 hover:border-brand-500">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <Package aria-hidden className="size-6" />
            </span>

            <h2 className="text-xl font-bold">
              {t('sourceTitle')}
            </h2>
          </div>

          <p className="mt-5 text-base leading-loose text-[var(--muted)] lg:text-lg">
            {t('source')}
          </p>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center  hover:border-brand-500">
          <h2 className="text-2xl font-bold">
            {t('ctaTitle')}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-[var(--muted)]">
            {t('ctaDescription')}
          </p>

          <Link
            href="/request"
            className="mt-6 inline-flex rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {t('orderCta')}
          </Link>
        </div>
      </Section>
    </>
  );
}
