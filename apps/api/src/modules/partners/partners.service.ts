import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { Partner, PartnerDocument } from './partner.schema';

@Injectable()
export class PartnersService extends BaseCrudService<Partner> {
  constructor(@InjectModel(Partner.name) model: Model<PartnerDocument>) {
    super(model as unknown as Model<Partner>, ['name.ar', 'name.en']);
  }
}
