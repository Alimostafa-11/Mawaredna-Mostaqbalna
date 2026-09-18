import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { INQUIRY_STATUSES, INQUIRY_TYPES } from '../inquiry.schema';

/** Egyptian mobile/landline, with or without country code. */
const PHONE_PATTERN = /^(\+?2)?0?1[0125]\d{8}$|^(\+?2)?0?\d{2,3}\d{6,8}$/;

export class CalculationSnapshotDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() areaFeddan?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() cropType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() soilType?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() estimatedTonsMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() estimatedTonsMax?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() estimatedCubicMetersMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() estimatedCubicMetersMax?: number;
}

export class CreateInquiryDto {
  @ApiProperty({ example: 'محمد أحمد' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: '01012345678' })
  @IsString()
  @Matches(PHONE_PATTERN, { message: 'phone must be a valid Egyptian number' })
  phone!: string;

  @ApiPropertyOptional({ example: 'farmer@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'مزرعة النيل' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  company?: string;

  @ApiPropertyOptional({ example: 'قنا' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  governorate?: string;

  @ApiPropertyOptional({ example: 'نقادة', description: 'Markaz within the governorate' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  center?: string;

  @ApiProperty({ enum: INQUIRY_TYPES })
  @IsIn(INQUIRY_TYPES as unknown as string[])
  type!: (typeof INQUIRY_TYPES)[number];

  @ApiPropertyOptional({ maxLength: 4000 })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  message?: string;

  @ApiPropertyOptional({ type: CalculationSnapshotDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CalculationSnapshotDto)
  calculation?: CalculationSnapshotDto;

  @ApiPropertyOptional({ example: '/ar/calculator' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  source?: string;

  @ApiPropertyOptional({ enum: ['ar', 'en'], default: 'ar' })
  @IsOptional()
  @IsIn(['ar', 'en'])
  locale?: 'ar' | 'en';

  /**
   * Honeypot: real users never fill this in, bots usually do. Rejected in the
   * service rather than by class-validator so the bot still gets a 201.
   */
  @ApiPropertyOptional({ description: 'Leave empty — spam trap' })
  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdateInquiryDto extends PartialType(
  PickType(CreateInquiryDto, [
    'name',
    'phone',
    'email',
    'company',
    'governorate',
    'center',
    'message',
  ] as const),
) {
  @ApiPropertyOptional({ enum: INQUIRY_STATUSES })
  @IsOptional()
  @IsIn(INQUIRY_STATUSES as unknown as string[])
  status?: (typeof INQUIRY_STATUSES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  internalNotes?: string;
}
