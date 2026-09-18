import type {
  CreateMediaPayload,
  MediaRecord,
  PresignedUpload,
} from './admin-types';
import type { MediaKind } from './types';

/**
 * Browser half of the gallery upload.
 *
 * The bytes never pass through the Next.js server or the API: the API signs a
 * PUT, the browser sends the file straight to S3, and only the resulting URL
 * and object key come back to be saved as a media record. That keeps a 200 MB
 * site video off both application containers.
 *
 * Every call to our own API goes through `/bff/admin/*`, which attaches the
 * httpOnly session token server-side - the browser never holds a bearer token.
 */

/** Mirrors ALLOWED_CONTENT_TYPES in the API's presign DTO. */
export const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export const VIDEO_TYPES = ['video/mp4', 'video/webm'] as const;

export const ACCEPTED_TYPES: readonly string[] = [...IMAGE_TYPES, ...VIDEO_TYPES];

/** Value for the file input's `accept`, so the picker filters for us too. */
export const ACCEPT_ATTRIBUTE = ACCEPTED_TYPES.join(',');

/**
 * Client-side ceilings. A presigned PUT cannot carry a size condition, so this
 * is a courtesy check that fails fast on the obvious mistake rather than a
 * security control - the bucket policy is what actually bounds an upload.
 */
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

export type UploadFailure =
  | 'type'
  | 'size'
  | 'presign'
  | 'transfer'
  | 'record'
  | 'storage';

/** Carries a reason code the UI can translate, rather than an English string. */
export class MediaUploadError extends Error {
  constructor(
    readonly reason: UploadFailure,
    detail?: string,
  ) {
    super(detail ?? reason);
    this.name = 'MediaUploadError';
  }
}

export function kindOf(file: File): MediaKind | null {
  if ((IMAGE_TYPES as readonly string[]).includes(file.type)) return 'image';
  if ((VIDEO_TYPES as readonly string[]).includes(file.type)) return 'video';
  return null;
}

export function maxBytesFor(kind: MediaKind): number {
  return kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function presign(
  fileName: string,
  contentType: string,
): Promise<PresignedUpload> {
  const response = await fetch('/bff/admin/uploads/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, contentType, folder: 'gallery' }),
  });

  if (!response.ok) {
    // 503 is the API saying S3_BUCKET was never configured, which is an
    // operator problem rather than something retrying will fix.
    throw new MediaUploadError(
      response.status === 503 ? 'storage' : 'presign',
      `presign responded ${response.status}`,
    );
  }

  return (await response.json()) as PresignedUpload;
}

/**
 * Uploads a blob to the signed URL.
 *
 * Uses XMLHttpRequest rather than fetch purely for `upload.onprogress` - a
 * site video takes long enough that a progress bar is the difference between
 * "working" and "broken" to whoever is waiting on it.
 */
function putToBucket(
  uploadUrl: string,
  body: Blob,
  contentType: string,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open('PUT', uploadUrl);
    request.setRequestHeader('Content-Type', contentType);

    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
      } else {
        reject(new MediaUploadError('transfer', `S3 responded ${request.status}`));
      }
    };

    request.onerror = () =>
      reject(new MediaUploadError('transfer', 'network error or bucket CORS'));
    request.onabort = () => reject(new MediaUploadError('transfer', 'aborted'));

    signal?.addEventListener('abort', () => request.abort(), { once: true });

    request.send(body);
  });
}

/**
 * Grabs a still from a video to use as its gallery poster.
 *
 * Read from a blob URL of the local file, so there is no CORS involved and no
 * second trip to the bucket. Best-effort by design: a codec the browser cannot
 * decode gives back `null` and the item is simply published without a poster.
 */
export async function capturePoster(file: File): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement('video');

  try {
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = objectUrl;

    await once(video, 'loadeddata');

    // A frame slightly into the clip; the very first one is often a fade-in.
    video.currentTime = Math.min(1, (video.duration || 2) / 2);
    await once(video, 'seeked');

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!canvas.width || !canvas.height) return null;

    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.82);
    });
  } catch {
    return null;
  } finally {
    video.src = '';
    URL.revokeObjectURL(objectUrl);
  }
}

/** Resolves on the given media event, and gives up rather than hanging. */
function once(video: HTMLVideoElement, event: string, timeoutMs = 10_000) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`timed out waiting for ${event}`));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      video.removeEventListener(event, onEvent);
      video.removeEventListener('error', onError);
    }

    function onEvent() {
      cleanup();
      resolve();
    }

    function onError() {
      cleanup();
      reject(new Error('video could not be decoded'));
    }

    video.addEventListener(event, onEvent, { once: true });
    video.addEventListener('error', onError, { once: true });
  });
}

export async function deleteBucketObject(key: string): Promise<void> {
  await fetch(`/bff/admin/uploads?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
  }).catch(() => undefined);
}

async function createMediaRecord(payload: CreateMediaPayload): Promise<MediaRecord> {
  const response = await fetch('/bff/admin/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new MediaUploadError('record', `POST /media responded ${response.status}`);
  }

  return (await response.json()) as MediaRecord;
}

export interface GalleryUploadInput {
  file: File;
  /** Optional, as on the record itself. */
  title?: CreateMediaPayload['title'];
  caption?: CreateMediaPayload['caption'];
  category: CreateMediaPayload['category'];
  order?: number;
  isActive?: boolean;
}

/**
 * Full path for one gallery item: validate, sign, transfer, poster, record.
 *
 * If the record cannot be written the uploaded object is removed again, so a
 * failed publish does not leave bytes in the bucket that nothing points at.
 */
export async function uploadGalleryItem(
  input: GalleryUploadInput,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
): Promise<MediaRecord> {
  const { file } = input;
  const kind = kindOf(file);

  if (!kind) throw new MediaUploadError('type', file.type || 'unknown');
  if (file.size > maxBytesFor(kind)) throw new MediaUploadError('size');

  const target = await presign(file.name, file.type);
  await putToBucket(target.uploadUrl, file, file.type, onProgress, signal);

  let poster: PresignedUpload | undefined;

  if (kind === 'video') {
    const frame = await capturePoster(file);

    if (frame) {
      try {
        poster = await presign('poster.jpg', 'image/jpeg');
        await putToBucket(poster.uploadUrl, frame, 'image/jpeg', undefined, signal);
      } catch {
        // A missing poster is cosmetic; never fail the video over it.
        poster = undefined;
      }
    }
  }

  try {
    return await createMediaRecord({
      title: input.title,
      caption: input.caption,
      kind,
      url: target.publicUrl,
      storageKey: target.key,
      thumbnailUrl: poster?.publicUrl,
      thumbnailStorageKey: poster?.key,
      category: input.category,
      order: input.order,
      isActive: input.isActive,
    });
  } catch (error) {
    await deleteBucketObject(target.key);
    if (poster) await deleteBucketObject(poster.key);
    throw error;
  }
}
