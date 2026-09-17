import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { PresignDto } from './dto/presign.dto';
import { S3Service } from './s3.service';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly s3: S3Service) {}

  @Post('presign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a short-lived S3 URL to upload a file directly' })
  async presign(@Body() dto: PresignDto) {
    if (!this.s3.isConfigured) {
      throw new ServiceUnavailableException('S3 storage is not configured');
    }

    const folder = dto.folder ?? 'gallery';
    // Taken from the validated content type rather than the submitted name, so
    // a stored key can never end in an extension the API does not allow.
    const extension = extensionFor(dto.contentType) || safeExtension(dto.fileName);
    const key = `${folder}/${new Date().getFullYear()}/${randomUUID()}${extension}`;

    return this.s3.createPresignedUpload({ key, contentType: dto.contentType });
  }

  @Delete()
  @ApiQuery({ name: 'key', required: true, example: 'gallery/2026/uuid.jpg' })
  @ApiOperation({ summary: 'Delete an object from the media bucket' })
  async remove(@Query('key') key: string) {
    if (!this.s3.isConfigured) {
      throw new ServiceUnavailableException('S3 storage is not configured');
    }

    return this.s3.delete(key);
  }
}

function extensionFor(contentType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/avif': '.avif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'application/pdf': '.pdf',
  };

  return map[contentType] ?? '';
}

/** Last resort for a content type outside the map: letters and digits only. */
function safeExtension(fileName: string): string {
  const extension = extname(fileName).toLowerCase();
  return /^\.[a-z0-9]{1,5}$/.test(extension) ? extension : '';
}
