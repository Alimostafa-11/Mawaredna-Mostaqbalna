import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService extends BaseCrudService<Product> {
  constructor(@InjectModel(Product.name) model: Model<ProductDocument>) {
    super(model as unknown as Model<Product>, [
      'name.ar',
      'name.en',
      'summary.ar',
      'summary.en',
    ]);
  }
}
