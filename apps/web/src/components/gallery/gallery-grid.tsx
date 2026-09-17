'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import type { MediaItem } from '@/lib/types';
import { localized } from '@/lib/utils';

/**
 * Gallery with category filtering.
 *
 * Filtering happens in the browser over an already-fetched list rather than
 * re-querying per category: the gallery is capped at 100 items, so a round
 * trip per filter click would cost more than it saves.
 *
 * Only categories that actually have media are offered as filters, so the
 * visitor never lands on an empty tab.
 */
export function GalleryGrid({ items }: { items: MediaItem[] }) {
  const t = useTranslations('gallery');
  const locale = useLocale() as Locale;
  const [active, setActive] = useState<string>('all');

  const categories = useMemo(() => {
    const present = new Set(items.map((item) => item.category));
    return ['all', ...Array.from(present)];
  }, [items]);

  const visible = useMemo(
    () => (active === 'all' ? items : items.filter((item) => item.category === active)),
    [items, active],
  );

  return (
    <>
      {categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active === category
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-[var(--border)] hover:border-brand-500'
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li
            key={item._id}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
          >
            <div className="relative aspect-4/3">
              {item.kind === 'video' ? (
                <video
                  src={item.url}
                  poster={item.thumbnailUrl || undefined}
                  controls
                  preload="none"
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src={item.url}
                  alt={localized(item.title, locale)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium">{localized(item.title, locale)}</h3>
              {item.caption && (
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {localized(item.caption, locale)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
