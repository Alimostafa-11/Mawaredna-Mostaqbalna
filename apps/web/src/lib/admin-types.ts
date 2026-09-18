import type {
  InquiryType,
  Localized,
  MediaCategory,
  MediaItem,
  MediaKind,
  OptionalLocalized,
} from './types';

export type { Paginated } from './types';
export { MEDIA_CATEGORIES } from './types';
export type { MediaCategory, MediaKind } from './types';

export type InquiryStatus = 'new' | 'in-progress' | 'quoted' | 'closed';

export const INQUIRY_STATUSES: InquiryStatus[] = [
  'new',
  'in-progress',
  'quoted',
  'closed',
];

export const INQUIRY_TYPES: InquiryType[] = [
  'compost-supply',
  'farm-quantities',
  'waste-collection',
  'waste-processing',
  'project-study',
  'partnership',
  'quote',
  'general',
];

export interface CalculationSnapshot {
  areaFeddan?: number;
  cropType?: string;
  soilType?: string;
  estimatedTonsMin?: number;
  estimatedTonsMax?: number;
  estimatedCubicMetersMin?: number;
  estimatedCubicMetersMax?: number;
}

/** A captured lead, as the admin endpoints return it. */
export interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  governorate: string;
  center: string;
  type: InquiryType;
  message: string;
  calculation?: CalculationSnapshot;
  status: InquiryStatus;
  source: string;
  locale: 'ar' | 'en';
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryStats {
  total: number;
  byStatus: Partial<Record<InquiryStatus, number>>;
  byType: Record<string, number>;
}

/** Minimal shapes for the content summary — only the publication flags. */
export interface ContentSummaryRow {
  key: string;
  labelKey: string;
  total: number;
  published: number;
  /** Records held back pending approval; undefined when not applicable. */
  pending?: number;
  note?: 'approval';
  
}

/**
 * A gallery item as the admin endpoints return it: the public `MediaItem`
 * plus the fields the panel needs but visitors never see - the ordering
 * weight, the publication flag and the S3 keys behind the URLs.
 */
export interface MediaRecord extends MediaItem {
  storageKey: string;
  thumbnailStorageKey: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Body of `POST /media`, written by the uploader once the bytes are in S3. */
export interface CreateMediaPayload {
  /** Optional, like every other label on a gallery item. */
  title?: OptionalLocalized;
  kind: MediaKind;
  /** The one field that is not optional - it is filled by the uploader from
   *  the S3 response, never typed, and a record without it has nothing to
   *  show. */
  url: string;
  storageKey: string;
  thumbnailUrl?: string;
  thumbnailStorageKey?: string;
  category: MediaCategory;
  caption?: OptionalLocalized;
  order?: number;
  isActive?: boolean;
}

/** Response of `POST /uploads/presign`. */
export interface PresignedUpload {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export interface PartnerRecord {
  _id: string;
  name: Localized;
  isApproved: boolean;
}
