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
