import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSettingsDto } from './dto/settings.dto';
import { SiteSettings, SiteSettingsDocument } from './settings.schema';

const SETTINGS_KEY = 'site';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly settingsModel: Model<SiteSettingsDocument>,
  ) {}

  /**
   * Upserts on read so a fresh database still serves a usable document
   * instead of a 404 that would blank the site header and footer.
   */
  async get(): Promise<SiteSettings> {
    const existing = await this.settingsModel
      .findOne({ key: SETTINGS_KEY })
      .lean<SiteSettings>()
      .exec();

    if (existing) {
      return existing;
    }

    const created = await this.settingsModel.create({
      key: SETTINGS_KEY,
      companyName: { ar: 'مواردنا مستقبلنا', en: 'Mawaredna Mostaqbalna' },
    });

    return created.toObject();
  }

  async update(dto: UpdateSettingsDto): Promise<SiteSettings> {
    return this.settingsModel
      .findOneAndUpdate(
        { key: SETTINGS_KEY },
        { $set: dto },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
      )
      .lean<SiteSettings>()
      .exec();
  }
}
