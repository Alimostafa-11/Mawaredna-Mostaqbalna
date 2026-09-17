import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Localized, LocalizedSchema } from '../../common/schemas/localized.schema';

export type ServiceDocument = HydratedDocument<ServiceItem>;

/**
 * "مجالات عمل الشركة" — the company's lines of work.
 *
 * NOTE: per the brief, every activity must match the commercial register and
 * the official licences before it is published, hence `isActive` defaulting to
 * true only for seeded, reviewed entries.
 */
@Schema({ timestamps: true, collection: 'services' })
export class ServiceItem {
  @Prop({ type: String, required: true, unique: true, trim: true, lowercase: true })
  slug!: string;

  @Prop({ type: LocalizedSchema, required: true })
  title!: Localized;

  @Prop({ type: LocalizedSchema, required: true })
  description!: Localized;

  /** lucide-react icon name rendered by the frontend. */
  @Prop({ type: String, default: 'leaf', trim: true })
  icon!: string;

  @Prop({ type: String, default: '', trim: true })
  imageUrl!: string;

  @Prop({ type: Number, default: 0, index: true })
  order!: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive!: boolean;
}

export const ServiceItemSchema = SchemaFactory.createForClass(ServiceItem);
