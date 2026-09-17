import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Internal tooling and the authenticated proxy. The dashboard also
      // sends `noindex` in its own metadata, so this is belt and braces.
      disallow: ['/dashboard', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
