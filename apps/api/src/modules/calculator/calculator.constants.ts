/**
 * Application-rate table for the farm calculator.
 *
 * The figures are conventional organic-matter application ranges used for
 * planning purposes in Egyptian agriculture, expressed in tonnes of finished
 * compost per feddan per season. They produce a PRELIMINARY estimate only:
 * the site states plainly that a soil analysis and a site visit are what
 * actually determine the dose, and every response carries that disclaimer.
 *
 * Tune these with the company agronomist before launch.
 */
export interface CropRate {
  key: string;
  labelAr: string;
  labelEn: string;
  /** Tonnes of compost per feddan, low end of the planning range. */
  tonsPerFeddanMin: number;
  /** Tonnes of compost per feddan, high end of the planning range. */
  tonsPerFeddanMax: number;
}

export const CROP_RATES: CropRate[] = [
  { key: 'field-crops', labelAr: 'محاصيل حقلية', labelEn: 'Field crops', tonsPerFeddanMin: 4, tonsPerFeddanMax: 6 },
  { key: 'vegetables', labelAr: 'خضروات', labelEn: 'Vegetables', tonsPerFeddanMin: 8, tonsPerFeddanMax: 12 },
  { key: 'orchards', labelAr: 'أشجار مثمرة وبساتين', labelEn: 'Orchards and fruit trees', tonsPerFeddanMin: 6, tonsPerFeddanMax: 10 },
  { key: 'sugarcane', labelAr: 'قصب السكر', labelEn: 'Sugarcane', tonsPerFeddanMin: 6, tonsPerFeddanMax: 8 },
  { key: 'palms', labelAr: 'نخيل', labelEn: 'Date palms', tonsPerFeddanMin: 5, tonsPerFeddanMax: 8 },
  { key: 'protected-agriculture', labelAr: 'زراعات محمية (صوب)', labelEn: 'Protected agriculture', tonsPerFeddanMin: 10, tonsPerFeddanMax: 15 },
  { key: 'newly-reclaimed', labelAr: 'أراضٍ مستصلحة حديثًا', labelEn: 'Newly reclaimed land', tonsPerFeddanMin: 10, tonsPerFeddanMax: 15 },
];

export interface SoilFactor {
  key: string;
  labelAr: string;
  labelEn: string;
  /** Multiplier applied to the crop rate. */
  factor: number;
}

export const SOIL_FACTORS: SoilFactor[] = [
  { key: 'sandy', labelAr: 'رملية', labelEn: 'Sandy', factor: 1.3 },
  { key: 'loamy', labelAr: 'صفراء (طميية)', labelEn: 'Loamy', factor: 1.0 },
  { key: 'clay', labelAr: 'طينية', labelEn: 'Clay', factor: 0.85 },
  { key: 'calcareous', labelAr: 'جيرية', labelEn: 'Calcareous', factor: 1.2 },
  { key: 'saline', labelAr: 'ملحية', labelEn: 'Saline', factor: 1.15 },
];

/**
 * Bulk density of the finished compost, from the product specification
 * (500-600 kg per cubic metre). Used to convert tonnes into cubic metres so
 * customers can plan transport.
 */
export const BULK_DENSITY_KG_PER_M3 = { min: 500, max: 600 } as const;

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
