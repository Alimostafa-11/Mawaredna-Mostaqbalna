import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { S3Service } from '../uploads/s3.service';
import { MediaDocument, MediaItem } from './media.schema';

@Injectable()
export class MediaService extends BaseCrudService<MediaItem> {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectModel(MediaItem.name) model: Model<MediaDocument>,
    private readonly s3: S3Service,
  ) {
    super(model as unknown as Model<MediaItem>, [
      'title.ar',
      'title.en',
      'caption.ar',
      'caption.en',
    ]);
  }

  /**
   * Deleting a gallery item also drops its objects from the bucket, so a
   * removed photo or video does not keep costing storage forever.
   *
   * The record goes first: if S3 is briefly unreachable the admin still gets
   * the delete they asked for, and the worst case is an orphaned object rather
   * than a row that cannot be removed. Failures are logged with the key so the
   * object can be swept up later.
   */
  override async remove(id: string): Promise<{ id: string; deleted: true }> {
    const item = await this.model.findByIdAndDelete(id).lean<MediaItem>().exec();

    if (!item) {
      throw new NotFoundException(`MediaItem ${id} was not found`);
    }

    await this.deleteObjects([item.storageKey, item.thumbnailStorageKey]);

    return { id, deleted: true };
  }

  private async deleteObjects(keys: (string | undefined)[]): Promise<void> {
    if (!this.s3.isConfigured) return;

    await Promise.all(
      keys
        .filter((key): key is string => Boolean(key))
        .map((key) =>
          this.s3.delete(key).catch((error: Error) => {
            this.logger.warn(`Could not delete S3 object "${key}": ${error.message}`);
          }),
        ),
    );
  }
}
