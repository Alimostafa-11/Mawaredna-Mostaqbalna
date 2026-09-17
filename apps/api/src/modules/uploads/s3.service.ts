import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBase: string;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get<string>('AWS_REGION', 'eu-central-1');
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    const endpoint = this.config.get<string>('S3_ENDPOINT');

    this.bucket = this.config.get<string>('S3_BUCKET', '');
    this.publicBase = (this.config.get<string>('S3_PUBLIC_URL') ?? '').replace(/\/$/, '');

    this.client = new S3Client({
      region,
      // Explicit keys are for local development only. On ECS / App Runner /
      // EC2 leave them unset so the SDK picks up the IAM role automatically.
      ...(accessKeyId && secretAccessKey
        ? { credentials: { accessKeyId, secretAccessKey } }
        : {}),
      ...(endpoint ? { endpoint } : {}),
      forcePathStyle: this.config.get<boolean>('S3_FORCE_PATH_STYLE', false),
    });
  }

  async onModuleInit() {
    if (!this.bucket) {
      this.logger.warn('S3_BUCKET is not set - media uploads are disabled');
      return;
    }

    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Connected to S3 bucket "${this.bucket}"`);
    } catch (error) {
      this.logger.warn(
        `Could not reach S3 bucket "${this.bucket}": ${(error as Error).message}`,
      );
    }
  }

  get isConfigured(): boolean {
    return Boolean(this.bucket);
  }

  /**
   * Browser-direct upload: the API signs a PUT and never proxies the bytes,
   * which keeps large photo and video uploads off the application container.
   */
  async createPresignedUpload(params: {
    key: string;
    contentType: string;
    expiresIn?: number;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      ContentType: params.contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: params.expiresIn ?? 900,
    });

    return { uploadUrl, key: params.key, publicUrl: this.publicUrl(params.key) };
  }

  publicUrl(key: string): string {
    if (this.publicBase) {
      return `${this.publicBase}/${key}`;
    }

    const region = this.config.get<string>('AWS_REGION', 'eu-central-1');
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    return { key, deleted: true as const };
  }
}
