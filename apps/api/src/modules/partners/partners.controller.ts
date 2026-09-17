import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PartnerQueryDto } from './dto/partner-query.dto';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';
import { PartnersService } from './partners.service';

@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List partners cleared for publication' })
  findAll(@Query() query: PartnerQueryDto) {
    return this.partnersService.findAll(query, {
      isApproved: true,
      ...(query.type ? { type: query.type } : {}),
    });
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreatePartnerDto) {
    return this.partnersService.create(dto as never);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdatePartnerDto) {
    return this.partnersService.update(id, dto as never);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
