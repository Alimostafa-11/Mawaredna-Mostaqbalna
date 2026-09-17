import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OptionalLocalizedDto } from '../../../common/dto/localized.dto';
import { MEDIA_CATEGORIES } from '../media.schema';

export class CreateMediaDto {
  @ApiPropertyOptional({ type: OptionalLocalizedDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedDto)
  title?: OptionalLocalizedDto;

  @ApiPropertyOptional({ enum: ['image', 'video'], default: 'image' })
  @IsOptional()
  @IsIn(['image', 'video'])
  kind?: 'image' | 'video';

  @ApiProperty()
  @IsString()
  url!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailStorageKey?: string;

  @ApiPropertyOptional({ enum: MEDIA_CATEGORIES })
  @IsOptional()
  @IsIn(MEDIA_CATEGORIES as unknown as string[])
  category?: (typeof MEDIA_CATEGORIES)[number];

  @ApiPropertyOptional({ type: OptionalLocalizedDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalLocalizedDto)
  caption?: OptionalLocalizedDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
