import type { InquiryType, Localized } from './types';

export type { Paginated } from './types';

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

export interface PartnerRecord {
  _id: string;
  name: Localized;
  isApproved: boolean;
}
