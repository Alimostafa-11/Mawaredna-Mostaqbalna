import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
import { MEDIA_CATEGORIES, type MediaCategory, type MediaKind } from '../media.schema';

export class MediaQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: MEDIA_CATEGORIES })
  @IsOptional()
  @IsIn(MEDIA_CATEGORIES as unknown as string[])
  category?: MediaCategory;

  @ApiPropertyOptional({ enum: ['image', 'video'] })
  @IsOptional()
  @IsIn(['image', 'video'])
  kind?: MediaKind;
}
