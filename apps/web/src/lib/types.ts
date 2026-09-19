/** Mirrors the API's bilingual content shape. `en` may be empty. */
export interface Localized {
  ar: string;
  en?: string;
}

/** Bilingual field where neither language is guaranteed - gallery labels. */
export interface OptionalLocalized {
  ar?: string;
  en?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ServiceItem {
  _id: string;
  slug: string;
  title: Localized;
  description: Localized;
  icon: string;
  imageUrl: string;
  order: number;
}

export interface Specification {
  label: Localized;
  value: string;
  unit: string;
}

export interface ProductionStage {
  title: Localized;
  description?: Localized;
  imageUrl: string;
  order: number;
}

export interface LabResult {
  title: Localized;
  fileUrl: string;
  laboratory?: Localized;
  issuedAt?: string;
}

export interface Product {
  _id: string;
  slug: string;
  name: Localized;
  summary: Localized;
  description?: Localized;
  rawMaterials: Localized[];
  productionStages: ProductionStage[];
  specifications: Specification[];
  usageInstructions: Localized[];
  labResults: LabResult[];
  packaging?: Localized;
  images: string[];
}

export interface Project {
  _id: string;
  slug: string;
  name: Localized;
  location: Localized;
  wasteType: Localized;
  wasteVolume?: number;
  wasteVolumeUnit: string;
  stages: Localized[];
  finalProduct?: Localized;
  images: string[];
  videos: string[];
  partners: Localized[];
  arePartnersApproved: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface Partner {
  _id: string;
  name: Localized;
  logoUrl: string;
  websiteUrl: string;
  type: 'client' | 'partner' | 'institution' | 'farm';
}

/** Kept in the order the gallery filter bar should offer them. Mirrors
 *  MEDIA_CATEGORIES in the API's media schema. */
export const MEDIA_CATEGORIES = [
  'work-sites',
  'equipment',
  'collection',
  'aggregation',
  'compost-windrows',
  'turning',
  'processing',
  'final-product',
  'supply',
  'farms',
  'team',
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export type MediaKind = 'image' | 'video';

export interface MediaItem {
  _id: string;
  /** Optional: photos are often published straight off a phone, unnamed. */
  title?: OptionalLocalized;
  kind: MediaKind;
  url: string;
  thumbnailUrl: string;
  category: MediaCategory;
  caption?: OptionalLocalized;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  x: string;
  tiktok: string;
}

export interface SiteSettings {
  companyName: Localized;
  slogan?: Localized;
  about?: Localized;
  vision?: Localized;
  mission?: Localized;
  goals: Localized[];
  address?: Localized;
  phones: string[];
  whatsapp: string;
  email: string;
  social: SocialLinks;
  location: { lat?: number; lng?: number; mapUrl: string };
  logoUrl: string;
  commercialRegisterNo: string;
  taxCardNo: string;
  servedGovernorates: string[];
  workingHoursFrom: number;
  workingHoursTo: number;
}

export interface CalculatorOption {
  key: string;
  labelAr: string;
  labelEn: string;
}

export interface CalculatorOptions {
  crops: CalculatorOption[];
  soils: CalculatorOption[];
  governorates: readonly CalculatorOption[];
}

export interface EstimateResult {
  input: {
    areaFeddan: number;
    cropType: string;
    soilType: string;
    governorate?: string;
  };
  tons: { min: number; max: number };
  cubicMeters: { min: number; max: number };
  /** Application rate for one feddan, by weight and by volume. */
  perFeddan: {
    tonsMin: number;
    tonsMax: number;
    cubicMetersMin: number;
    cubicMetersMax: number;
  };
  basis: {
    cropLabelAr: string;
    cropLabelEn: string;
    soilLabelAr: string;
    soilLabelEn: string;
    soilFactor: number;
    bulkDensityKgPerM3: { min: number; max: number };
  };
  disclaimerAr: string;
  disclaimerEn: string;
}

export type InquiryType =
  | 'compost-supply'
  | 'farm-quantities'
  | 'waste-collection'
  | 'waste-processing'
  | 'project-study'
  | 'partnership'
  | 'quote'
  | 'general';

export interface InquiryPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  governorate?: string;
  /** Markaz within the governorate. */
  center?: string;
  type: InquiryType;
  message?: string;
  source?: string;
  locale?: 'ar' | 'en';
  website?: string;
  calculation?: {
    areaFeddan?: number;
    cropType?: string;
    soilType?: string;
    estimatedTonsMin?: number;
    estimatedTonsMax?: number;
    estimatedCubicMetersMin?: number;
    estimatedCubicMetersMax?: number;
  };
}
