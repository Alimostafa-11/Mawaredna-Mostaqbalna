import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { ServiceDocument, ServiceItem } from './service.schema';

@Injectable()
export class ServicesService extends BaseCrudService<ServiceItem> {
  constructor(
    @InjectModel(ServiceItem.name) model: Model<ServiceDocument>,
  ) {
    super(model as unknown as Model<ServiceItem>, [
      'title.ar',
      'title.en',
      'description.ar',
      'description.en',
    ]);
  }
}
