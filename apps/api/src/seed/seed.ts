import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { AuthService } from '../modules/auth/auth.service';
import { Product } from '../modules/products/product.schema';
import { ServiceItem } from '../modules/services/service.schema';
import { SiteSettings } from '../modules/settings/settings.schema';
import { COMPOST_SEED, SERVICES_SEED, SETTINGS_SEED } from './seed-data';

/**
 * Idempotent: every write is an upsert keyed on `slug` / `key`, so running the
 * seed against a populated database refreshes the brief-derived content
 * without touching anything the team has edited elsewhere.
 */
async function seed() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const config = app.get(ConfigService);

    const settingsModel = app.get<Model<SiteSettings>>(getModelToken(SiteSettings.name));
    const servicesModel = app.get<Model<ServiceItem>>(getModelToken(ServiceItem.name));
    const productsModel = app.get<Model<Product>>(getModelToken(Product.name));

    await settingsModel.updateOne(
      { key: SETTINGS_SEED.key },
      { $setOnInsert: SETTINGS_SEED },
      { upsert: true },
    );
    logger.log('Site settings ready');

    for (const service of SERVICES_SEED) {
      await servicesModel.updateOne(
        { slug: service.slug },
        { $set: service },
        { upsert: true },
      );
    }
    logger.log(`Seeded ${SERVICES_SEED.length} lines of work`);

    await productsModel.updateOne(
      { slug: COMPOST_SEED.slug },
      { $set: COMPOST_SEED },
      { upsert: true },
    );
    logger.log('Seeded the compost product');

    const adminEmail = config.get<string>('ADMIN_EMAIL');
    const adminPassword = config.get<string>('ADMIN_PASSWORD');

    if (adminEmail && adminPassword) {
      await app.get(AuthService).ensureAdminExists(adminEmail, adminPassword);
    } else {
      logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set - no admin account created');
    }

    logger.log('Seed complete');
    logger.warn(
      'Projects, partners and gallery media are intentionally empty - add them ' +
        'through the admin API once the licences, lab reports and partner ' +
        'consents are on file.',
    );
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  new Logger('Seed').error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
