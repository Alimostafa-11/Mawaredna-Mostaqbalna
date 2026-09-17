import type { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

/**
 * Banner at the top of every inner page. Renders the page's only `h1`.
 */
export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-[var(--border)] bg-brand-50 dark:bg-brand-950/40">
      {/* Decorative leaf-vein wash; purely presentational. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-brand-200),transparent_65%)] opacity-40 dark:opacity-20"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-[var(--muted)] lg:text-lg">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
