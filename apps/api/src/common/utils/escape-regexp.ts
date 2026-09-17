/**
 * Escapes a user-supplied string so it can be embedded in a RegExp literal.
 *
 * Search terms arrive straight from query strings, so without this a visitor
 * could send a pattern that is expensive to evaluate.
 */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Builds a case-insensitive "contains" matcher from raw user input. */
export function buildSearchRegex(term: string): RegExp {
  return new RegExp(escapeRegExp(term.trim()), 'i');
}
