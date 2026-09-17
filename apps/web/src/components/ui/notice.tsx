import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Used for the compliance and disclaimer notes the brief requires: that
 * published activities match the commercial register, that technical claims
 * wait on lab reports, and that calculator output is an estimate.
 *
 * Deliberately quiet rather than alarming — these are standing caveats, not
 * errors.
 */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Placeholder for sections whose content is pending client sign-off
 * (projects, partner logos, gallery media).
 */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <p className="text-sm text-[var(--muted)]">{message}</p>
    </div>
  );
}
