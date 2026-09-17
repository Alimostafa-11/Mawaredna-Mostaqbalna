import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from './media.controller';
import { MediaItem, MediaItemSchema } from './media.schema';
import { MediaService } from './media.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MediaItem.name, schema: MediaItemSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
