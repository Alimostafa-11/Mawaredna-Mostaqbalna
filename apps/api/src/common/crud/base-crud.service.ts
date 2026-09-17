import { NotFoundException } from '@nestjs/common';
import { Model, QueryFilter, SortOrder, UpdateQuery } from 'mongoose';
import { Paginated, PaginationQueryDto } from '../dto/pagination.dto';
import { buildSearchRegex } from '../utils/escape-regexp';

/**
 * Shared read/write behaviour for the editorial collections (services,
 * products, projects, partners, media). Each module subclasses this and only
 * adds what is genuinely specific to it.
 */
export abstract class BaseCrudService<T> {
  protected constructor(
    protected readonly model: Model<T>,
    /** Fields scanned by the `q` search parameter. */
    protected readonly searchFields: string[] = ['title.ar', 'title.en'],
    /** Default sort — editorial collections are hand-ordered. */
    protected readonly defaultSort: Record<string, SortOrder> = {
      order: 1,
      createdAt: -1,
    },
  ) {}

  async create(dto: Partial<T>): Promise<T> {
    return this.model.create(dto) as Promise<T>;
  }

  async findAll(
    query: PaginationQueryDto,
    extraFilter: QueryFilter<T> = {},
  ): Promise<Paginated<T>> {
    const filter: QueryFilter<T> = { ...extraFilter };

    if (query.q?.trim()) {
      const regex = buildSearchRegex(query.q);
      Object.assign(filter, {
        $or: this.searchFields.map((field) => ({ [field]: regex })),
      });
    }

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(this.defaultSort)
        .skip(skip)
        .limit(query.limit)
        .lean<T[]>()
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.max(1, Math.ceil(total / query.limit)),
    };
  }

  async findOne(id: string): Promise<T> {
    const doc = await this.model.findById(id).lean<T>().exec();

    if (!doc) {
      throw new NotFoundException(`${this.model.modelName} ${id} was not found`);
    }

    return doc;
  }

  async findBySlug(slug: string): Promise<T> {
    const doc = await this.model
      .findOne({ slug } as QueryFilter<T>)
      .lean<T>()
      .exec();

    if (!doc) {
      throw new NotFoundException(`${this.model.modelName} "${slug}" was not found`);
    }

    return doc;
  }

  async update(id: string, dto: UpdateQuery<T>): Promise<T> {
    const doc = await this.model
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .lean<T>()
      .exec();

    if (!doc) {
      throw new NotFoundException(`${this.model.modelName} ${id} was not found`);
    }

    return doc;
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const result = await this.model.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`${this.model.modelName} ${id} was not found`);
    }

    return { id, deleted: true };
  }
}
