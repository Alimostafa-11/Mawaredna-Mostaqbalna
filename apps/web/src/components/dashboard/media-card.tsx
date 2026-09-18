'use client';

import { Button, Input, Label, TextField, toast } from '@heroui/react';
import { Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  MEDIA_CATEGORIES,
  type MediaCategory,
  type MediaRecord,
} from '@/lib/admin-types';

/**
 * One gallery item in the panel: preview, bilingual text, category, ordering
 * weight, and the two destructive-ish actions.
 *
 * Hiding is offered next to deleting and listed first, because "take it off
 * the site" is almost always what is actually wanted - deleting also drops the
 * file from the bucket and cannot be undone.
 */
/** Both languages blank means "no label", which the API stores as null. */
function localizedOrNull(ar: string, en: string) {
  return ar.trim() || en.trim() ? { ar: ar.trim(), en: en.trim() } : null;
}

export function MediaCard({ item }: { item: MediaRecord }) {
  const t = useTranslations('dashboard.media');
  const tCategories = useTranslations('gallery.categories');
  const router = useRouter();

  const [titleAr, setTitleAr] = useState(item.title?.ar ?? '');
  const [titleEn, setTitleEn] = useState(item.title?.en ?? '');
  const [captionAr, setCaptionAr] = useState(item.caption?.ar ?? '');
  const [captionEn, setCaptionEn] = useState(item.caption?.en ?? '');
  const [category, setCategory] = useState<MediaCategory>(item.category);
  const [order, setOrder] = useState(String(item.order ?? 0));

  const [isSaving, setIsSaving] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isDirty =
    titleAr !== (item.title?.ar ?? '') ||
    titleEn !== (item.title?.en ?? '') ||
    captionAr !== (item.caption?.ar ?? '') ||
    captionEn !== (item.caption?.en ?? '') ||
    category !== item.category ||
    order !== String(item.order ?? 0);

  async function patch(body: Record<string, unknown>) {
    const response = await fetch(`/bff/admin/media/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(String(response.status));
  }

  async function save() {
    setIsSaving(true);

    try {
      await patch({
        // A field cleared in the form is sent as null rather than omitted,
        // which is what makes clearing it actually stick.
        title: localizedOrNull(titleAr, titleEn),
        caption: localizedOrNull(captionAr, captionEn),
        category,
        order: Number(order) || 0,
      });

      toast.success(t('list.saved'));
      router.refresh();
    } catch {
      toast.danger(t('list.saveError'));
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleVisibility() {
    setIsBusy(true);

    try {
      await patch({ isActive: !item.isActive });
      toast.success(item.isActive ? t('list.hidden') : t('list.shown'));
      router.refresh();
    } catch {
      toast.danger(t('list.saveError'));
    } finally {
      setIsBusy(false);
    }
  }

  async function remove() {
    setIsBusy(true);

    try {
      const response = await fetch(`/bff/admin/media/${item._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(String(response.status));

      toast.success(t('list.deleted'));
      router.refresh();
    } catch {
      toast.danger(t('list.deleteError'));
      setIsBusy(false);
      setIsConfirmingDelete(false);
    }
  }

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="relative aspect-4/3 bg-black/5 dark:bg-white/5">
        {item.kind === 'video' ? (
          <video
            src={item.url}
            poster={item.thumbnailUrl || undefined}
            controls
            preload="none"
            playsInline
            className="size-full object-cover"
          />
        ) : (
          /* Plain <img> rather than next/image: these are admin-only
             thumbnails, and this way the panel keeps working even before
             NEXT_PUBLIC_MEDIA_HOST is pointed at the bucket or CDN. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.title?.ar ?? ''}
            loading="lazy"
            className="size-full object-cover"
          />
        )}

        {!item.isActive && (
          <span className="absolute top-2 start-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
            {t('list.hiddenBadge')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <TextField value={titleAr} onChange={setTitleAr} fullWidth>
          <Label>{t('fields.titleAr')}</Label>
          <Input />
        </TextField>

        <TextField value={titleEn} onChange={setTitleEn} fullWidth>
          <Label>{t('fields.titleEn')}</Label>
          <Input dir="ltr" />
        </TextField>

        <TextField value={captionAr} onChange={setCaptionAr} fullWidth>
          <Label>{t('fields.captionAr')}</Label>
          <Input />
        </TextField>

        <TextField value={captionEn} onChange={setCaptionEn} fullWidth>
          <Label>{t('fields.captionEn')}</Label>
          <Input dir="ltr" />
        </TextField>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`category-${item._id}`}>{t('fields.category')}</Label>
            <select
              id={`category-${item._id}`}
              value={category}
              onChange={(event) => setCategory(event.target.value as MediaCategory)}
              className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--field-background)] px-3 py-2 text-sm"
            >
              {MEDIA_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {tCategories(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor={`order-${item._id}`}>{t('fields.order')}</Label>
            <input
              id={`order-${item._id}`}
              type="number"
              inputMode="numeric"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--field-background)] px-3 py-2 text-sm tabular"
            />
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button onPress={save} isDisabled={isSaving || isBusy || !isDirty}>
            <Save aria-hidden className="size-4" />
            {isSaving ? t('list.saving') : t('list.save')}
          </Button>

          <Button
            variant="secondary"
            onPress={toggleVisibility}
            isDisabled={isBusy || isSaving}
          >
            {item.isActive ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
            {item.isActive ? t('list.hide') : t('list.show')}
          </Button>

          {isConfirmingDelete ? (
            <>
              <Button variant="danger" onPress={remove} isDisabled={isBusy}>
                <Trash2 aria-hidden className="size-4" />
                {isBusy ? t('list.deleting') : t('list.confirmDelete')}
              </Button>

              <Button
                variant="ghost"
                onPress={() => setIsConfirmingDelete(false)}
                isDisabled={isBusy}
              >
                {t('list.cancel')}
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onPress={() => setIsConfirmingDelete(true)}
              isDisabled={isBusy || isSaving}
            >
              <Trash2 aria-hidden className="size-4" />
              {t('list.delete')}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
