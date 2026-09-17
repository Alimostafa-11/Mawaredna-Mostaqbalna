import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { InquiryQueryDto } from './dto/inquiry-query.dto';
import { CreateInquiryDto, UpdateInquiryDto } from './dto/inquiry.dto';
import { InquiriesService } from './inquiries.service';
import { INQUIRY_STATUSES, INQUIRY_TYPES } from './inquiry.schema';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a service request, quote request or message' })
  submit(@Body() dto: CreateInquiryDto, @Ip() ip: string) {
    return this.inquiriesService.submit(dto, ip);
  }

  @Public()
  @Get('types')
  @ApiOperation({ summary: 'List the request types the form accepts' })
  types() {
    return { types: INQUIRY_TYPES, statuses: INQUIRY_STATUSES };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List captured leads (admin)' })
  findAll(@Query() query: InquiryQueryDto) {
    return this.inquiriesService.findAll(query);
  }

  @Get('stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lead counts by status and type (admin)' })
  stats() {
    return this.inquiriesService.stats();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead status or internal notes (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.inquiriesService.update(id, dto);
  }
}
