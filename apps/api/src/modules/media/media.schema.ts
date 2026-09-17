import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Localized, LocalizedSchema } from '../../common/schemas/localized.schema';

export type MediaDocument = HydratedDocument<MediaItem>;

export type MediaKind = 'image' | 'video';

/** Gallery categories taken directly from the brief's shot list. */
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

@Schema({ timestamps: true, collection: 'media' })
export class MediaItem {
  @Prop({ type: LocalizedSchema, required: true })
  title!: Localized;

  @Prop({ type: String, enum: ['image', 'video'], default: 'image', index: true })
  kind!: MediaKind;

  /** Public URL (CDN or S3) of the asset. */
  @Prop({ type: String, required: true, trim: true })
  url!: string;

  /** S3 object key, kept so the object can be deleted with the record. */
  @Prop({ type: String, default: '', trim: true })
  storageKey!: string;

  @Prop({ type: String, default: '', trim: true })
  thumbnailUrl!: string;

  /** S3 key of the poster frame, so it is deleted with the video it belongs to. */
  @Prop({ type: String, default: '', trim: true })
  thumbnailStorageKey!: string;

  @Prop({ type: String, enum: MEDIA_CATEGORIES, default: 'work-sites', index: true })
  category!: MediaCategory;

  @Prop({ type: LocalizedSchema })
  caption?: Localized;

  @Prop({ type: Number, default: 0, index: true })
  order!: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive!: boolean;
}

export const MediaItemSchema = SchemaFactory.createForClass(MediaItem);
