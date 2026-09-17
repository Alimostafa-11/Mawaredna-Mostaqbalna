import type { Locale } from '@/i18n/routing';
import type { Localized } from './types';

/**
 * Reads a bilingual field for the active locale.
 *
 * Arabic is the source of truth for this site, so an English page falls back
 * to Arabic rather than rendering an empty slot when a translation is missing.
 */
export function localized(value: Localized | undefined, locale: Locale): string {
  if (!value) return '';
  if (locale === 'en') return value.en?.trim() || value.ar;
  return value.ar;
}

/** Picks the right label from the API's flat `labelAr` / `labelEn` option shape. */
export function optionLabel(
  option: { labelAr: string; labelEn: string },
  locale: Locale,
): string {
  return locale === 'en' ? option.labelEn || option.labelAr : option.labelAr;
}

/** Strips everything a `tel:` / `wa.me` link cannot contain. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}

/** Formats a numeric range as "min – max", collapsing equal bounds. */
export function formatRange(min: number, max: number, locale: Locale): string {
  const format = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    maximumFractionDigits: 1,
  });

  return min === max ? format.format(min) : `${format.format(min)} - ${format.format(max)}`;
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Date and time for the dashboard's lead lists.
 *
 * Pinned to Africa/Cairo so every member of the team reads the same timestamp
 * regardless of the machine they are on.
 */
export function formatDateTime(value: string, locale: Locale): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Cairo',
  }).format(date);
}

/** Renders an hour-of-day (0-23) as a locale-appropriate clock time. */
export function formatHour(hour: number, locale: Locale): string {
  const date = new Date(Date.UTC(2000, 0, 1, hour, 0));

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}
