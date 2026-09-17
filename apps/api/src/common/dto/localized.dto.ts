import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LocalizedDto {
  @ApiProperty({ example: 'كمبوست عضوي' })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  ar!: string;

  @ApiPropertyOptional({ example: 'Organic compost' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  en?: string;
}
