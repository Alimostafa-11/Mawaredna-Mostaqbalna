import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { LocalizedDto } from '../../../common/dto/localized.dto';

const PARTNER_TYPES = ['client', 'partner', 'institution', 'farm'] as const;

export class CreatePartnerDto {
  @ApiProperty({ type: LocalizedDto })
  @ValidateNested()
  @Type(() => LocalizedDto)
  name!: LocalizedDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @ApiPropertyOptional({ enum: PARTNER_TYPES, default: 'partner' })
  @IsOptional()
  @IsIn(PARTNER_TYPES as unknown as string[])
  type?: (typeof PARTNER_TYPES)[number];

  @ApiPropertyOptional({
    default: false,
    description: 'Set once written consent to publish the logo is on file',
  })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;
}

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {}
