import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/** Only formats the gallery and the lab-report viewer can actually render. */
export const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm',
  'application/pdf',
] as const;

export const UPLOAD_FOLDERS = [
  'gallery',
  'products',
  'projects',
  'partners',
  'lab-results',
  'branding',
] as const;

export class PresignDto {
  @ApiProperty({ example: 'windrow-turning.jpg' })
  @IsString()
  @MaxLength(200)
  @Matches(/^[\w.\- ()]+$/, {
    message: 'fileName may only contain letters, digits, spaces, dot, dash, underscore and parentheses',
  })
  fileName!: string;

  @ApiProperty({ enum: ALLOWED_CONTENT_TYPES })
  @IsIn(ALLOWED_CONTENT_TYPES as unknown as string[])
  contentType!: (typeof ALLOWED_CONTENT_TYPES)[number];

  @ApiPropertyOptional({ enum: UPLOAD_FOLDERS, default: 'gallery' })
  @IsOptional()
  @IsIn(UPLOAD_FOLDERS as unknown as string[])
  folder?: (typeof UPLOAD_FOLDERS)[number];
}
