import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { getAdminToken, getApiUrl } from '@/lib/admin-auth';

/**
 * Authenticated pass-through to the admin API.
 *
 * The session token is httpOnly, so browser code cannot call the API directly.
 * Instead it calls `/api/admin/<path>` and this handler attaches the bearer
 * token server-side. The caller gains nothing beyond what their own session
 * already permits — the API still enforces the guard on every route.
 */
const FORWARDED_HEADERS = ['content-type'];

/**
 * Cache tags the public pages attach to their reads, keyed by the API resource
 * a write lands on. Without this a photo uploaded in the panel would sit
 * invisible on /gallery until the five-minute revalidate window lapsed, which
 * reads as a broken upload rather than a cached page.
 */
const CONTENT_TAGS: Record<string, string> = {
  settings: 'settings',
  services: 'services',
  products: 'products',
  projects: 'projects',
  partners: 'partners',
  media: 'media',
};

async function proxy(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const token = await getAdminToken();

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { path } = await context.params;

  // Defence in depth: keep a crafted path from climbing out of the API's
  // versioned base and hitting an unrelated host path.
  if (path.some((segment) => segment === '..' || segment.includes('\\'))) {
    return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
  }

  const search = new URL(request.url).search;
  const target = `${getApiUrl()}/${path.map(encodeURIComponent).join('/')}${search}`;

  const headers = new Headers({ Authorization: `Bearer ${token}` });

  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: 'no-store',
  }).catch(() => null);

  if (!response) {
    return NextResponse.json(
      { message: 'Could not reach the API' },
      { status: 502 },
    );
  }

  // Only on a write that actually succeeded - a rejected PATCH has changed
  // nothing, so dropping the cache would just cost everyone a re-render.
  if (hasBody && response.ok) {
    const tag = CONTENT_TAGS[path[0]];
    // `expire: 0` so the next visitor gets the new content rather than one
    // more serving of the stale page.
    if (tag) revalidateTag(tag, { expire: 0 });
  }

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
    },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
