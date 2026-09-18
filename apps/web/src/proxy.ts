import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Locale negotiation and redirection.
 *
 * Next 16 renamed this file convention from `middleware` to `proxy`; the
 * handler itself is unchanged, so next-intl's factory is still what runs here.
 * It sends a bare `/` to `/ar` (or `/en` when the visitor's Accept-Language
 * asks for it) and rewrites unprefixed paths onto the active locale.
 */
export default createMiddleware(routing);

export const config = {
  // Everything except Next internals, the app's own /bff routes, the
  // dashboard, and any path that looks like a static file (contains a dot).
  //
  // `/dashboard` is excluded on purpose: it is internal tooling with no
  // localized URLs, so it must not be rewritten to `/ar/dashboard`. `/bff`
  // is the app's own server-side routes and must reach them unrewritten;
  // `/api` stays excluded so it can be pointed at the backend by a proxy.
  matcher: ['/((?!bff|api|dashboard|_next|_vercel|.*\\..*).*)'],
};
