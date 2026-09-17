import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { createGlobalLimiter, createStrictLimiter } from './common/rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = config.get<number>('PORT', 4000);
  const prefix = config.get<string>('API_PREFIX', 'api');
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  app.setGlobalPrefix(prefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Sits behind an ALB / CloudFront in AWS, so trust the proxy for the client
  // IP used by rate limiting.
  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: isProduction ? undefined : false,
    }),
  );
  app.use(compression());

  const prefixPath = '/' + prefix;
  app.use(
    prefixPath,
    createGlobalLimiter(
      config.get<number>('THROTTLE_TTL', 60_000),
      config.get<number>('THROTTLE_LIMIT', 60),
    ),
  );

  const strictLimiter = createStrictLimiter();
  app.use(prefixPath + '/v1/auth/login', strictLimiter);
  app.use(prefixPath + '/v1/inquiries', strictLimiter);

  const origins = config
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  app.enableShutdownHooks();

  // Off in production unless ENABLE_SWAGGER explicitly says otherwise, which
  // lets the local docker-compose stack run production-like settings and
  // still serve the docs.
  const enableSwagger = config.get<boolean>('ENABLE_SWAGGER') ?? !isProduction;

  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Mawaredna Mostaqbalna API')
      .setDescription(
        'Agricultural waste recycling, compost production and organic fertilisers.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${prefix}/docs`, app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log(`Swagger UI available at http://localhost:${port}/${prefix}/docs`);
  }

  await app.listen(port, '0.0.0.0');
  logger.log(`API listening on http://localhost:${port}/${prefix}/v1`);
}

void bootstrap();
