import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Localized, LocalizedSchema } from '../../common/schemas/localized.schema';

export type ProjectDocument = HydratedDocument<Project>;

/**
 * "المشروعات وسابقة الأعمال" — completed and ongoing projects.
 *
 * Partner names are only rendered once `arePartnersApproved` is set, matching
 * the brief's requirement to publish third-party names after written consent.
 */
@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ type: String, required: true, unique: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ type: LocalizedSchema, required: true })
  name!: Localized;

  @Prop({ type: LocalizedSchema, required: true })
  location!: Localized;

  /** نوع المخلفات */
  @Prop({ type: LocalizedSchema, required: true })
  wasteType!: Localized;

  /** حجم المخلفات التي تم التعامل معها */
  @Prop({ type: Number, min: 0 })
  wasteVolume?: number;

  @Prop({ type: String, default: 'ton', trim: true })
  wasteVolumeUnit!: string;

  /** مراحل العمل */
  @Prop({ type: [LocalizedSchema], default: [] })
  stages!: Localized[];

  /** المنتج النهائي */
  @Prop({ type: LocalizedSchema })
  finalProduct?: Localized;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: [String], default: [] })
  videos!: string[];

  /** الجهات أو الشركاء المشاركون */
  @Prop({ type: [LocalizedSchema], default: [] })
  partners!: Localized[];

  @Prop({ type: Boolean, default: false })
  arePartnersApproved!: boolean;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({ type: Number, default: 0, index: true })
  order!: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive!: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
