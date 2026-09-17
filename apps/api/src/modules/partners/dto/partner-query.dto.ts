import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
import type { PartnerType } from '../partner.schema';

const PARTNER_TYPES = ['client', 'partner', 'institution', 'farm'] as const;

export class PartnerQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: PARTNER_TYPES })
  @IsOptional()
  @IsIn(PARTNER_TYPES as unknown as string[])
  type?: PartnerType;
}
