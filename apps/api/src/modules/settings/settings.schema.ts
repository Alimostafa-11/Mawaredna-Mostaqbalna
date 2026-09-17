import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Localized, LocalizedSchema } from '../../common/schemas/localized.schema';

export type SiteSettingsDocument = HydratedDocument<SiteSettings>;

@Schema({ _id: false })
export class SocialLinks {
  @Prop({ type: String, default: '', trim: true }) facebook!: string;
  @Prop({ type: String, default: '', trim: true }) instagram!: string;
  @Prop({ type: String, default: '', trim: true }) linkedin!: string;
  @Prop({ type: String, default: '', trim: true }) youtube!: string;
  @Prop({ type: String, default: '', trim: true }) x!: string;
  @Prop({ type: String, default: '', trim: true }) tiktok!: string;
}
export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);

@Schema({ _id: false })
export class GeoLocation {
  @Prop({ type: Number }) lat?: number;
  @Prop({ type: Number }) lng?: number;
  @Prop({ type: String, default: '', trim: true }) mapUrl!: string;
}
export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);

/**
 * Single-document collection holding everything the site header, footer and
 * the contact page render. Fetched by key "site".
 */
@Schema({ timestamps: true, collection: 'settings' })
export class SiteSettings {
  @Prop({ type: String, default: 'site', unique: true, index: true })
  key!: string;

  @Prop({ type: LocalizedSchema, required: true })
  companyName!: Localized;

  @Prop({ type: LocalizedSchema })
  slogan?: Localized;

  @Prop({ type: LocalizedSchema })
  about?: Localized;

  @Prop({ type: LocalizedSchema })
  vision?: Localized;

  @Prop({ type: LocalizedSchema })
  mission?: Localized;

  @Prop({ type: [LocalizedSchema], default: [] })
  goals!: Localized[];

  @Prop({ type: LocalizedSchema })
  address?: Localized;

  @Prop({ type: [String], default: [] })
  phones!: string[];

  @Prop({ type: String, default: '', trim: true })
  whatsapp!: string;

  @Prop({ type: String, default: '', trim: true, lowercase: true })
  email!: string;

  @Prop({ type: SocialLinksSchema, default: () => ({}) })
  social!: SocialLinks;

  @Prop({ type: GeoLocationSchema, default: () => ({}) })
  location!: GeoLocation;

  @Prop({ type: String, default: '', trim: true })
  logoUrl!: string;

  /** Registration data, shown in the footer only once verified. */
  @Prop({ type: String, default: '', trim: true })
  commercialRegisterNo!: string;

  @Prop({ type: String, default: '', trim: true })
  taxCardNo!: string;

  @Prop({ type: [String], default: [] })
  servedGovernorates!: string[];

  @Prop({ type: Number, default: 9 })
  workingHoursFrom!: number;

  @Prop({ type: Number, default: 17 })
  workingHoursTo!: number;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
