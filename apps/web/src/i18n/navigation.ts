import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware replacements for next/link and the navigation hooks. Always
 * import from here rather than from `next/link`, otherwise the locale prefix
 * is dropped.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
