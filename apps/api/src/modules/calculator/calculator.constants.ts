/**
 * Application-rate table for the farm calculator.
 *
 * Each crop carries TWO independent planning ranges - one by weight, one by
 * volume. Volume is not derived from weight here: the company quotes cubic
 * metres from its own loading experience, which does not track the nominal
 * bulk density exactly.
 *
 *   tonnes = area x cropTons
 *   m3     = area x cropCubic
 *
 * Soil type is collected but does not affect the quantity.
 *
 * They produce a PRELIMINARY estimate only: the site states plainly that a
 * soil analysis and a site visit are what actually determine the dose, and
 * every response carries that disclaimer.
 *
 * CONFIRMED with the client: date palms, 4-7 t/feddan and 8-13 m3/feddan.
 * The other six rows are proportional placeholders and still need the
 * company agronomist's figures before launch.
 */
export interface CropRate {
  key: string;
  labelAr: string;
  labelEn: string;
  /** Tonnes of compost per feddan. */
  tonsPerFeddanMin: number;
  tonsPerFeddanMax: number;
  /** Cubic metres per feddan. */
  cubicMetersPerFeddanMin: number;
  cubicMetersPerFeddanMax: number;
}

export const CROP_RATES: CropRate[] = [
  { key: 'field-crops', labelAr: 'محاصيل حقلية', labelEn: 'Field crops', tonsPerFeddanMin: 7, tonsPerFeddanMax: 10, cubicMetersPerFeddanMin: 10, cubicMetersPerFeddanMax: 15 },
  { key: 'vegetables', labelAr: 'خضروات', labelEn: 'Vegetables', tonsPerFeddanMin: 7, tonsPerFeddanMax: 10, cubicMetersPerFeddanMin: 14, cubicMetersPerFeddanMax: 19 },
  { key: 'orchards', labelAr: 'أشجار مثمرة وبساتين', labelEn: 'Orchards and fruit trees', tonsPerFeddanMin: 5, tonsPerFeddanMax: 8, cubicMetersPerFeddanMin: 10, cubicMetersPerFeddanMax: 15 },
  { key: 'sugarcane', labelAr: 'قصب السكر', labelEn: 'Sugarcane', tonsPerFeddanMin: 5, tonsPerFeddanMax: 7, cubicMetersPerFeddanMin: 10, cubicMetersPerFeddanMax: 13 },
  // Confirmed by the client.
  { key: 'palms', labelAr: 'نخيل', labelEn: 'Date palms', tonsPerFeddanMin: 4, tonsPerFeddanMax: 7, cubicMetersPerFeddanMin: 8, cubicMetersPerFeddanMax: 13 },
  { key: 'protected-agriculture', labelAr: 'زراعات محمية (صوب)', labelEn: 'Protected agriculture', tonsPerFeddanMin: 8, tonsPerFeddanMax: 12, cubicMetersPerFeddanMin: 16, cubicMetersPerFeddanMax: 22 },
  { key: 'newly-reclaimed', labelAr: 'أراضٍ مستصلحة حديثًا', labelEn: 'Newly reclaimed land', tonsPerFeddanMin: 8, tonsPerFeddanMax: 12, cubicMetersPerFeddanMin: 16, cubicMetersPerFeddanMax: 22 },
];

export interface SoilType {
  key: string;
  labelAr: string;
  labelEn: string;
}

/**
 * Collected for the sales conversation and stored on the resulting lead, but
 * deliberately NOT part of the arithmetic - the quantity comes from the crop
 * rate alone.
 */
export const SOIL_TYPES: SoilType[] = [
  { key: 'sandy', labelAr: 'رملية', labelEn: 'Sandy' },
  { key: 'loamy', labelAr: 'صفراء (طميية)', labelEn: 'Loamy' },
  { key: 'clay', labelAr: 'طينية', labelEn: 'Clay' },
  { key: 'calcareous', labelAr: 'جيرية', labelEn: 'Calcareous' },
  { key: 'saline', labelAr: 'ملحية', labelEn: 'Saline' },
];

/** Governorates the company can currently serve. Edit before launch. */
export const GOVERNORATES = [
  { key: 'qena', labelAr: 'قنا', labelEn: 'Qena' },
  { key: 'luxor', labelAr: 'الأقصر', labelEn: 'Luxor' },
  { key: 'aswan', labelAr: 'أسوان', labelEn: 'Aswan' },
  { key: 'sohag', labelAr: 'سوهاج', labelEn: 'Sohag' },
  { key: 'assiut', labelAr: 'أسيوط', labelEn: 'Assiut' },
  { key: 'minya', labelAr: 'المنيا', labelEn: 'Minya' },
  { key: 'beni-suef', labelAr: 'بني سويف', labelEn: 'Beni Suef' },
  { key: 'fayoum', labelAr: 'الفيوم', labelEn: 'Fayoum' },
  { key: 'giza', labelAr: 'الجيزة', labelEn: 'Giza' },
  { key: 'cairo', labelAr: 'القاهرة', labelEn: 'Cairo' },
  { key: 'sharqia', labelAr: 'الشرقية', labelEn: 'Sharqia' },
  { key: 'beheira', labelAr: 'البحيرة', labelEn: 'Beheira' },
  { key: 'noubaria', labelAr: 'النوبارية', labelEn: 'Noubaria' },
  { key: 'ismailia', labelAr: 'الإسماعيلية', labelEn: 'Ismailia' },
  { key: 'other', labelAr: 'محافظة أخرى', labelEn: 'Other governorate' },
] as const;
