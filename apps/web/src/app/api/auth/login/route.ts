import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  getApiUrl,
} from '@/lib/admin-auth';

/**
 * Exchanges credentials for a session cookie.
 *
 * The browser never sees the JWT: this handler calls the API, then stores the
 * token in an httpOnly cookie. That keeps it out of reach of any script on the
 * page, which matters because the dashboard displays customers' names and
 * phone numbers.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  }).catch(() => null);

  if (!response) {
    return NextResponse.json(
      { message: 'Could not reach the API' },
      { status: 502 },
    );
  }

  const payload = (await response.json().catch(() => ({}))) as {
    accessToken?: string;
    user?: unknown;
    message?: string | string[];
  };

  if (!response.ok || !payload.accessToken) {
    const message = Array.isArray(payload.message)
      ? payload.message.join(', ')
      : (payload.message ?? 'Login failed');

    // Pass the API's status through, so the rate limiter's 429 is
    // distinguishable from bad credentials.
    return NextResponse.json({ message }, { status: response.status || 401 });
  }

  const store = await cookies();

  store.set(ADMIN_COOKIE, payload.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  return NextResponse.json({ user: payload.user });
}
