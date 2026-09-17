import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { MediaDocument, MediaItem } from './media.schema';

@Injectable()
export class MediaService extends BaseCrudService<MediaItem> {
  constructor(@InjectModel(MediaItem.name) model: Model<MediaDocument>) {
    super(model as unknown as Model<MediaItem>, [
      'title.ar',
      'title.en',
      'caption.ar',
      'caption.en',
    ]);
  }
}
