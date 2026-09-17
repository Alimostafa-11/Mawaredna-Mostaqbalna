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
import { MediaQueryDto } from './dto/media-query.dto';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { MEDIA_CATEGORIES } from './media.schema';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List gallery items' })
  findAll(@Query() query: MediaQueryDto) {
    return this.mediaService.findAll(query, {
      isActive: true,
      ...(query.category ? { category: query.category } : {}),
      ...(query.kind ? { kind: query.kind } : {}),
    });
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'List the available gallery categories' })
  categories() {
    return { categories: MEDIA_CATEGORIES };
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateMediaDto) {
    return this.mediaService.create(dto as never);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.update(id, dto as never);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
