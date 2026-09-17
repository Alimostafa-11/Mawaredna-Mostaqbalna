import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InquiryDocument = HydratedDocument<Inquiry>;

/** Request types offered in "خدمات الشركات والمزارع" plus the generic ones. */
export const INQUIRY_TYPES = [
  'compost-supply',
  'farm-quantities',
  'waste-collection',
  'waste-processing',
  'project-study',
  'partnership',
  'quote',
  'general',
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_STATUSES = ['new', 'in-progress', 'quoted', 'closed'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** Snapshot of the farm calculator inputs/outputs attached to a quote request. */
@Schema({ _id: false })
export class CalculationSnapshot {
  @Prop({ type: Number }) areaFeddan?: number;
  @Prop({ type: String }) cropType?: string;
  @Prop({ type: String }) soilType?: string;
  @Prop({ type: Number }) estimatedTonsMin?: number;
  @Prop({ type: Number }) estimatedTonsMax?: number;
  @Prop({ type: Number }) estimatedCubicMetersMin?: number;
  @Prop({ type: Number }) estimatedCubicMetersMax?: number;
}
export const CalculationSnapshotSchema =
  SchemaFactory.createForClass(CalculationSnapshot);

/**
 * Every lead the site captures — service requests, quote requests from the
 * farm calculator, and plain contact-form messages — lands here. This is the
 * "قاعدة بيانات العملاء" the brief asks the site to build up.
 */
@Schema({ timestamps: true, collection: 'inquiries' })
export class Inquiry {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: String, required: true, trim: true })
  phone!: string;

  @Prop({ type: String, default: '', trim: true, lowercase: true })
  email!: string;

  @Prop({ type: String, default: '', trim: true })
  company!: string;

  @Prop({ type: String, default: '', trim: true })
  governorate!: string;

  @Prop({ type: String, enum: INQUIRY_TYPES, required: true, index: true })
  type!: InquiryType;

  @Prop({ type: String, default: '', trim: true })
  message!: string;

  @Prop({ type: CalculationSnapshotSchema })
  calculation?: CalculationSnapshot;

  @Prop({ type: String, enum: INQUIRY_STATUSES, default: 'new', index: true })
  status!: InquiryStatus;

  /** Which page the request came from, for basic attribution. */
  @Prop({ type: String, default: '', trim: true })
  source!: string;

  @Prop({ type: String, enum: ['ar', 'en'], default: 'ar' })
  locale!: 'ar' | 'en';

  @Prop({ type: String, default: '', trim: true, select: false })
  ipAddress!: string;

  @Prop({ type: String, default: '', trim: true })
  internalNotes!: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);

InquirySchema.index({ createdAt: -1 });
