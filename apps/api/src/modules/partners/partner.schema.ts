import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Localized, LocalizedSchema } from '../../common/schemas/localized.schema';

export type PartnerDocument = HydratedDocument<Partner>;

export type PartnerType = 'client' | 'partner' | 'institution' | 'farm';

/**
 * "العملاء والشركاء".
 *
 * `isApproved` gates publication: the brief requires written consent before a
 * third-party logo appears on the site, so the public endpoint filters on it.
 */
@Schema({ timestamps: true, collection: 'partners' })
export class Partner {
  @Prop({ type: LocalizedSchema, required: true })
  name!: Localized;

  @Prop({ type: String, default: '', trim: true })
  logoUrl!: string;

  @Prop({ type: String, default: '', trim: true })
  websiteUrl!: string;

  @Prop({
    type: String,
    enum: ['client', 'partner', 'institution', 'farm'],
    default: 'partner',
    index: true,
  })
  type!: PartnerType;

  @Prop({ type: Boolean, default: false, index: true })
  isApproved!: boolean;

  @Prop({ type: Number, default: 0, index: true })
  order!: number;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
