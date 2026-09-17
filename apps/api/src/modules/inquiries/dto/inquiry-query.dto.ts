import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';
import {
  INQUIRY_STATUSES,
  INQUIRY_TYPES,
  type InquiryStatus,
  type InquiryType,
} from '../inquiry.schema';

export class InquiryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: INQUIRY_STATUSES })
  @IsOptional()
  @IsIn(INQUIRY_STATUSES as unknown as string[])
  status?: InquiryStatus;

  @ApiPropertyOptional({ enum: INQUIRY_TYPES })
  @IsOptional()
  @IsIn(INQUIRY_TYPES as unknown as string[])
  type?: InquiryType;
}
