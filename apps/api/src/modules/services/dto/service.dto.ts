import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { LocalizedDto } from '../../../common/dto/localized.dto';

export class CreateServiceDto {
  @ApiProperty({ example: 'agricultural-waste-collection' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case',
  })
  slug!: string;

  @ApiProperty({ type: LocalizedDto })
  @ValidateNested()
  @Type(() => LocalizedDto)
  title!: LocalizedDto;

  @ApiProperty({ type: LocalizedDto })
  @ValidateNested()
  @Type(() => LocalizedDto)
  description!: LocalizedDto;

  @ApiPropertyOptional({ example: 'tractor' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
