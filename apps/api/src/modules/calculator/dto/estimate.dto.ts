import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { CROP_RATES, SOIL_TYPES } from '../calculator.constants';

const CROP_KEYS = CROP_RATES.map((c) => c.key);
const SOIL_KEYS = SOIL_TYPES.map((s) => s.key);

export class EstimateDto {
  @ApiProperty({ example: 25, description: 'Farm area in feddan', minimum: 0.1 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(100000)
  areaFeddan!: number;

  @ApiProperty({ enum: CROP_KEYS, example: 'vegetables' })
  @IsIn(CROP_KEYS)
  cropType!: string;

  @ApiProperty({ enum: SOIL_KEYS, example: 'sandy' })
  @IsIn(SOIL_KEYS)
  soilType!: string;

  @ApiPropertyOptional({ example: 'qena' })
  @IsOptional()
  @IsString()
  governorate?: string;
}
