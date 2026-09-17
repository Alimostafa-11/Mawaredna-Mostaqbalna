import { join } from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Where gallery media is served from, as next/image needs it.
 *
 * Accepts either a bare hostname (`cdn.mawaredna.com`, assumed https) or a
 * full origin (`http://localhost:9000`), which is what the local MinIO in
 * docker-compose serves on - an https-only pattern would reject every uploaded
 * photo in development.
 */
function mediaPattern() {
  const value = process.env.NEXT_PUBLIC_MEDIA_HOST?.trim();

  if (!value) return [];

  if (!value.includes('://')) {
    return [{ protocol: 'https' as const, hostname: value, pathname: '/**' }];
  }

  try {
    const { protocol, hostname, port } = new URL(value);

    return [
      {
        protocol: protocol.replace(':', '') as 'http' | 'https',
        hostname,
        ...(port ? { port } : {}),
        pathname: '/**',
      },
    ];
  } catch {
    console.warn(`Ignoring unparseable NEXT_PUBLIC_MEDIA_HOST: ${value}`);
    return [];
  }
}

const mediaPatterns = mediaPattern();

/**
 * Next refuses to optimise an image whose host resolves to a private address,
 * as an SSRF guard. The local docker-compose stack serves media from MinIO on
 * localhost, which trips exactly that check - so the guard is lifted only when
 * the configured media host is itself a loopback address, which no deployment
 * pointing at a real bucket or CDN can be.
 */
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '::1'];
const servesMediaLocally = mediaPatterns.some(
  (pattern) =>
    LOOPBACK_HOSTS.includes(pattern.hostname) ||
    // e.g. the compose stack's minio.localhost, which resolves to a container
    // address on the server side and to loopback in the browser.
    pattern.hostname.endsWith('.localhost'),
);

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
    remotePatterns: mediaPatterns,
    ...(servesMediaLocally ? { dangerouslyAllowLocalIP: true } : {}),
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
