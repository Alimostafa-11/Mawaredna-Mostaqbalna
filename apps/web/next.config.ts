import { join } from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const s3Host = process.env.NEXT_PUBLIC_MEDIA_HOST;

const nextConfig: NextConfig = {
  // Produces a self-contained server bundle, which is what the Docker image
  // and the ECS / App Runner deployment run.
  output: 'standalone',
  // This app lives in an npm workspace, so tracing has to start at the repo
  // root for the standalone bundle to pick up hoisted dependencies.
  outputFileTracingRoot: join(import.meta.dirname, '../../'),
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: s3Host
      ? [{ protocol: 'https', hostname: s3Host, pathname: '/**' }]
      : [],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
