import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  /** Tints the section so alternating bands stay visually separated. */
  tone?: 'default' | 'muted' | 'brand';
  id?: string;
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<SectionProps['tone']>, string> = {
  default: '',
  muted: 'bg-[var(--surface-secondary)]',
  brand: 'bg-brand-50 dark:bg-brand-950/40',
};

export function Section({ children, tone = 'default', id, className }: SectionProps) {
  return (
    <section id={id} className={`py-16 lg:py-20 ${TONE_CLASSES[tone]} ${className ?? ''}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Centred headings suit landing sections; start-aligned suit content pages. */
  align?: 'start' | 'center';
  as?: 'h1' | 'h2';
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-start'}`}
    >
      <Tag className="text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-[var(--muted)] lg:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
