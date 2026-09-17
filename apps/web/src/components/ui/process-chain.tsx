import { useTranslations } from 'next-intl';
import { PROCESS_STAGES } from '@/lib/process-stages';
import { ServiceIcon } from './service-icon';

/**
 * The waste-to-product chain.
 *
 * Rendered as an ordered list so the sequence is carried by the markup rather
 * than by visual order alone, which also keeps it correct when the grid wraps
 * and when the page flips to RTL.
 */
export function ProcessChain() {
  const t = useTranslations('process');

  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {PROCESS_STAGES.map((stage, index) => (
        <li
          key={stage.key}
          className="group relative flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center transition-colors hover:border-brand-500"
        >
          <span className="absolute start-3 top-3 text-xs font-semibold text-[var(--muted)] tabular">
            {index + 1}
          </span>

          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            <ServiceIcon name={stage.icon} className="size-6" />
          </span>

          <span className="text-sm font-medium leading-snug">
            {t(`stages.${stage.key}`)}
          </span>
        </li>
      ))}
    </ol>
  );
}
