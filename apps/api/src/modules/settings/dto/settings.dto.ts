import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { LocalizedDto } from '../../../common/dto/localized.dto';

export class SocialLinksDto {
  @ApiPropertyOptional() @IsOptional() @IsString() facebook?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instagram?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() youtube?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() x?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tiktok?: string;
}

export class GeoLocationDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(-90) @Max(90) lat?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(-180) @Max(180) lng?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() mapUrl?: string;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional() @ValidateNested() @Type(() => LocalizedDto) companyName?: LocalizedDto;

  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional() @ValidateNested() @Type(() => LocalizedDto) slogan?: LocalizedDto;

  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional() @ValidateNested() @Type(() => LocalizedDto) about?: LocalizedDto;

  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional() @ValidateNested() @Type(() => LocalizedDto) vision?: LocalizedDto;

  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional() @ValidateNested() @Type(() => LocalizedDto) mission?: LocalizedDto;

  @ApiPropertyOptional({ type: [LocalizedDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => LocalizedDto) goals?: LocalizedDto[];

  @ApiPropertyOptional({ type: LocalizedDto })
  @IsOptional() @ValidateNested() @Type(() => LocalizedDto) address?: LocalizedDto;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true }) phones?: string[];

  @ApiPropertyOptional() @IsOptional() @IsString() whatsapp?: string;

  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;

  @ApiPropertyOptional({ type: SocialLinksDto })
  @IsOptional() @ValidateNested() @Type(() => SocialLinksDto) social?: SocialLinksDto;

  @ApiPropertyOptional({ type: GeoLocationDto })
  @IsOptional() @ValidateNested() @Type(() => GeoLocationDto) location?: GeoLocationDto;

  @ApiPropertyOptional() @IsOptional() @IsString() logoUrl?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() commercialRegisterNo?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() taxCardNo?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true }) servedGovernorates?: string[];

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(24) workingHoursFrom?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) @Max(24) workingHoursTo?: number;
}
