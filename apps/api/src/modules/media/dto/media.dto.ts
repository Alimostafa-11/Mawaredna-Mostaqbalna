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
import { LocalizedDto } from '../../../common/dto/localized.dto';
import { MEDIA_CATEGORIES } from '../media.schema';

export class CreateMediaDto {
  @ApiProperty({ type: LocalizedDto })
  @ValidateNested()
  @Type(() => LocalizedDto)
  title!: LocalizedDto;

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

  @ApiPropertyOptional({ enum: MEDIA_CATEGORIES })
  @IsOptional()
  @IsIn(MEDIA_CATEGORIES as unknown as string[])
  category?: (typeof MEDIA_CATEGORIES)[number];

  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDto)
  caption?: LocalizedDto;

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
