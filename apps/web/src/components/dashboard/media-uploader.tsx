'use client';

import { Button, Input, Label, TextField, toast } from '@heroui/react';
import { Film, ImageIcon, Trash2, UploadCloud, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { MEDIA_CATEGORIES, type MediaCategory } from '@/lib/admin-types';
import {
  ACCEPT_ATTRIBUTE,
  MediaUploadError,
  formatBytes,
  kindOf,
  maxBytesFor,
  titleFromFileName,
  uploadGalleryItem,
  type UploadFailure,
} from '@/lib/media-upload';
import type { MediaKind } from '@/lib/types';

/**
 * `crypto.randomUUID` only exists in a secure context, and the panel is
 * occasionally opened over plain http on a LAN address while testing. These
 * ids never leave the browser, so any unique string will do.
 */
function newId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  kind: MediaKind | null;
  title: string;
  category: MediaCategory;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: UploadFailure;
}

/**
 * Drop-zone uploader for gallery photos and videos.
 *
 * Files are staged first so the team can name and categorise a whole shoot
 * before anything leaves the machine - naming twenty windrow photos after the
 * fact is how a gallery ends up full of "IMG_4471".
 *
 * Uploads run one at a time on purpose: a phone video is tens of megabytes and
 * a site office uplink is not, so saturating it with parallel PUTs would only
 * make every file finish later.
 */
export function MediaUploader({ nextOrder }: { nextOrder: number }) {
  const t = useTranslations('dashboard.media');
  const tCategories = useTranslations('gallery.categories');
  const router = useRouter();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [publishNow, setPublishNow] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * Previews are blob URLs; without this the page leaks one per staged file.
   * The cleanup reads through a ref rather than closing over `queue`, which
   * on an unmount-only effect would still be the empty array it started as.
   */
  const queueRef = useRef(queue);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(
    () => () => {
      for (const item of queueRef.current) URL.revokeObjectURL(item.previewUrl);
    },
    [],
  );

  function add(files: FileList | File[]) {
    const staged: QueueItem[] = [];

    for (const file of Array.from(files)) {
      const kind = kindOf(file);

      if (!kind) {
        toast.danger(t('errors.typeNamed', { name: file.name }));
        continue;
      }

      if (file.size > maxBytesFor(kind)) {
        toast.danger(
          t('errors.sizeNamed', {
            name: file.name,
            max: formatBytes(maxBytesFor(kind)),
          }),
        );
        continue;
      }

      staged.push({
        id: newId(),
        file,
        previewUrl: URL.createObjectURL(file),
        kind,
        title: titleFromFileName(file.name),
        category: 'work-sites',
        status: 'pending',
        progress: 0,
      });
    }

    if (staged.length > 0) setQueue((current) => [...current, ...staged]);
  }

  function patch(id: string, changes: Partial<QueueItem>) {
    setQueue((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  function remove(id: string) {
    setQueue((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  }

  function clearAll() {
    setQueue((current) => {
      for (const item of current) URL.revokeObjectURL(item.previewUrl);
      return [];
    });
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) add(event.dataTransfer.files);
  }

  async function uploadAll() {
    const pending = queue.filter((item) => item.status !== 'done');

    if (pending.some((item) => !item.title.trim())) {
      toast.danger(t('errors.titleRequired'));
      return;
    }

    setIsUploading(true);
    let uploaded = 0;

    for (const [index, item] of pending.entries()) {
      patch(item.id, { status: 'uploading', progress: 0, error: undefined });

      try {
        await uploadGalleryItem(
          {
            file: item.file,
            title: { ar: item.title.trim() },
            category: item.category,
            order: nextOrder + index,
            isActive: publishNow,
          },
          (percent) => patch(item.id, { progress: percent }),
        );

        patch(item.id, { status: 'done', progress: 100 });
        uploaded += 1;
      } catch (error) {
        const reason =
          error instanceof MediaUploadError ? error.reason : 'transfer';

        console.error(error);
        patch(item.id, { status: 'error', error: reason });
      }
    }

    setIsUploading(false);

    if (uploaded > 0) {
      toast.success(t('upload.uploaded', { count: uploaded }));
      // Drop the finished rows and let the server component re-read the list.
      setQueue((current) => {
        for (const item of current) {
          if (item.status === 'done') URL.revokeObjectURL(item.previewUrl);
        }
        return current.filter((item) => item.status !== 'done');
      });
      router.refresh();
    }
  }

  const pendingCount = queue.filter((item) => item.status !== 'done').length;

  return (
    <section
      aria-label={t('upload.title')}
      className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div>
        <h2 className="text-base font-semibold">{t('upload.title')}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{t('upload.subtitle')}</p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
            : 'border-[var(--border)]'
        }`}
      >
        <UploadCloud aria-hidden className="size-8 text-[var(--muted)]" />
        <p className="text-sm">{t('upload.drop')}</p>

        <Button variant="secondary" onPress={() => inputRef.current?.click()}>
          {t('upload.browse')}
        </Button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          aria-label={t('upload.browse')}
          onChange={(event) => {
            if (event.target.files) add(event.target.files);
            // Lets the same file be picked again after it was removed.
            event.target.value = '';
          }}
        />

        <p className="text-xs text-[var(--muted)]">{t('upload.accepted')}</p>
      </div>

      {queue.length > 0 && (
        <>
          <ul className="flex flex-col gap-3">
            {queue.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-surface-secondary p-3 sm:flex-row sm:items-start"
              >
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                  {/* Local blob preview, so plain <img>/<video> rather than
                      next/image - there is no remote host to optimise. */}
                  {item.kind === 'video' ? (
                    <video
                      src={item.previewUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="size-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  )}

                  <span className="absolute bottom-1 start-1 rounded bg-black/60 p-1 text-white">
                    {item.kind === 'video' ? (
                      <Film aria-label={t('kinds.video')} className="size-3" />
                    ) : (
                      <ImageIcon aria-label={t('kinds.image')} className="size-3" />
                    )}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="truncate text-xs text-[var(--muted)]" dir="ltr">
                    {item.file.name} · {formatBytes(item.file.size)}
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <TextField
                      value={item.title}
                      onChange={(value) => patch(item.id, { title: value })}
                      isDisabled={isUploading}
                      fullWidth
                    >
                      <Label>{t('fields.titleAr')}</Label>
                      <Input placeholder={t('fields.titleArPlaceholder')} />
                    </TextField>

                    <div>
                      <Label htmlFor={`queue-category-${item.id}`}>
                        {t('fields.category')}
                      </Label>
                      <select
                        id={`queue-category-${item.id}`}
                        value={item.category}
                        disabled={isUploading}
                        onChange={(event) =>
                          patch(item.id, {
                            category: event.target.value as MediaCategory,
                          })
                        }
                        className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--field-background)] px-3 py-2 text-sm"
                      >
                        {MEDIA_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {tCategories(category)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {item.status === 'uploading' && (
                    <div
                      role="progressbar"
                      aria-valuenow={item.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={t('upload.uploading')}
                      className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]"
                    >
                      <div
                        className="h-full bg-brand-600 transition-[width]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {item.status === 'error' && item.error && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {t(`errors.${item.error}`)}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  aria-label={t('upload.remove')}
                  isDisabled={isUploading}
                  onPress={() => remove(item.id)}
                >
                  <X aria-hidden className="size-4" />
                </Button>
              </li>
            ))}
          </ul>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={publishNow}
              disabled={isUploading}
              onChange={(event) => setPublishNow(event.target.checked)}
              className="size-4 accent-[var(--brand-600,#16a34a)]"
            />
            {t('upload.publishNow')}
          </label>

          <div className="flex flex-wrap gap-2">
            <Button onPress={uploadAll} isDisabled={isUploading || pendingCount === 0}>
              <UploadCloud aria-hidden className="size-4" />
              {isUploading
                ? t('upload.uploading')
                : t('upload.start', { count: pendingCount })}
            </Button>

            <Button variant="ghost" isDisabled={isUploading} onPress={clearAll}>
              <Trash2 aria-hidden className="size-4" />
              {t('upload.clear')}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
