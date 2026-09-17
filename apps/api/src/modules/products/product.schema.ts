import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Localized, LocalizedSchema } from '../../common/schemas/localized.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class Specification {
  @Prop({ type: LocalizedSchema, required: true })
  label!: Localized;

  /** Kept as free text so ranges like "500-600 kg/m3" stay intact. */
  @Prop({ type: String, required: true, trim: true })
  value!: string;

  @Prop({ type: String, default: '', trim: true })
  unit!: string;
}
export const SpecificationSchema = SchemaFactory.createForClass(Specification);

@Schema({ _id: false })
export class ProductionStage {
  @Prop({ type: LocalizedSchema, required: true })
  title!: Localized;

  @Prop({ type: LocalizedSchema })
  description?: Localized;

  @Prop({ type: String, default: '', trim: true })
  imageUrl!: string;

  @Prop({ type: Number, default: 0 })
  order!: number;
}
export const ProductionStageSchema = SchemaFactory.createForClass(ProductionStage);

@Schema({ _id: false })
export class LabResult {
  @Prop({ type: LocalizedSchema, required: true })
  title!: Localized;

  /** S3 key or public URL of the scanned report. */
  @Prop({ type: String, required: true, trim: true })
  fileUrl!: string;

  @Prop({ type: LocalizedSchema })
  laboratory?: Localized;

  @Prop({ type: Date })
  issuedAt?: Date;
}
export const LabResultSchema = SchemaFactory.createForClass(LabResult);

/**
 * "كمبوست مواردنا مستقبلنا" and any further organic products.
 *
 * Technical claims are only rendered on the site when they are backed by an
 * uploaded lab report, which is why `specifications` and `labResults` live
 * together on the same document.
 */
@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ type: String, required: true, unique: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ type: LocalizedSchema, required: true })
  name!: Localized;

  @Prop({ type: LocalizedSchema, required: true })
  summary!: Localized;

  @Prop({ type: LocalizedSchema })
  description?: Localized;

  /** مصدر المواد الخام */
  @Prop({ type: [LocalizedSchema], default: [] })
  rawMaterials!: Localized[];

  /** مراحل التصنيع والمعالجة */
  @Prop({ type: [ProductionStageSchema], default: [] })
  productionStages!: ProductionStage[];

  /** المواصفات الفنية */
  @Prop({ type: [SpecificationSchema], default: [] })
  specifications!: Specification[];

  /** طرق الاستخدام */
  @Prop({ type: [LocalizedSchema], default: [] })
  usageInstructions!: Localized[];

  /** نتائج التحاليل المعملية */
  @Prop({ type: [LabResultSchema], default: [] })
  labResults!: LabResult[];

  /** التعبئة والتوريد */
  @Prop({ type: LocalizedSchema })
  packaging?: Localized;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: Number, default: 0, index: true })
  order!: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
