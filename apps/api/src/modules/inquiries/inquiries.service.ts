import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Paginated } from '../../common/dto/pagination.dto';
import { buildSearchRegex } from '../../common/utils/escape-regexp';
import { InquiryQueryDto } from './dto/inquiry-query.dto';
import { CreateInquiryDto, UpdateInquiryDto } from './dto/inquiry.dto';
import { Inquiry, InquiryDocument } from './inquiry.schema';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectModel(Inquiry.name)
    private readonly inquiryModel: Model<InquiryDocument>,
  ) {}

  async submit(dto: CreateInquiryDto, ipAddress = '') {
    const { website, ...payload } = dto;

    // Honeypot hit: acknowledge without storing, so the bot sees success and
    // does not retry with a different shape.
    if (website) {
      this.logger.warn(`Discarded honeypot submission from ${ipAddress || 'unknown IP'}`);
      return { id: null, received: true };
    }

    const created = await this.inquiryModel.create({ ...payload, ipAddress });

    this.logger.log(`New "${created.type}" inquiry from ${created.phone}`);

    return { id: String(created._id), received: true };
  }

  async findAll(query: InquiryQueryDto): Promise<Paginated<Inquiry>> {
    const filter: QueryFilter<InquiryDocument> = {};

    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;

    if (query.q?.trim()) {
      const regex = buildSearchRegex(query.q);
      filter.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { company: regex },
        { message: regex },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.inquiryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean<Inquiry[]>()
        .exec(),
      this.inquiryModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.max(1, Math.ceil(total / query.limit)),
    };
  }

  async update(id: string, dto: UpdateInquiryDto) {
    return this.inquiryModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .lean()
      .exec();
  }

  async stats() {
    const byStatus = await this.inquiryModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byType = await this.inquiryModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return {
      total: await this.inquiryModel.countDocuments().exec(),
      byStatus: Object.fromEntries(byStatus.map((r) => [r._id, r.count])),
      byType: Object.fromEntries(byType.map((r) => [r._id, r.count])),
    };
  }
}
