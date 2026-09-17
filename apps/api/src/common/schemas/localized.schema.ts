import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Every piece of editorial content is stored in both languages. Arabic is the
 * primary language of the site, so `ar` is required and `en` is optional —
 * the frontend falls back to `ar` when a translation is missing.
 */
@Schema({ _id: false })
export class Localized {
  @ApiProperty({ example: 'كمبوست عضوي' })
  @Prop({ type: String, required: true, trim: true })
  ar!: string;

  @ApiProperty({ example: 'Organic compost', required: false })
  @Prop({ type: String, required: false, trim: true, default: '' })
  en?: string;
}

export const LocalizedSchema = SchemaFactory.createForClass(Localized);

/**
 * Same shape, but with nothing required.
 *
 * Editorial collections describe themselves in words, so their labels are
 * mandatory. A gallery photo does not: a batch comes off a phone at a work
 * site and is published as-is, and forcing a name on each one only produces
 * captions nobody meant to write.
 */
@Schema({ _id: false })
export class OptionalLocalized {
  @ApiProperty({ example: 'كمبوست عضوي', required: false })
  @Prop({ type: String, required: false, trim: true, default: '' })
  ar?: string;

  @ApiProperty({ example: 'Organic compost', required: false })
  @Prop({ type: String, required: false, trim: true, default: '' })
  en?: string;
}

export const OptionalLocalizedSchema =
  SchemaFactory.createForClass(OptionalLocalized);
