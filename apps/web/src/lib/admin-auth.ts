import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE = 'admin_token';

/** Matches the API's default JWT_EXPIRES_IN of 7 days. */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

export interface AdminUser {
  sub: string;
  email: string;
  role: 'admin' | 'editor';
}

/**
 * The bearer token lives in an httpOnly cookie, so page scripts can never read
 * it. Every admin request is therefore made server-side, or proxied through
 * `/bff/admin/*` which attaches the token for the browser.
 */
export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? null;
}

/** Redirects to the login page when there is no session. */
export async function requireAdminToken(): Promise<string> {
  const token = await getAdminToken();

  if (!token) {
    redirect('/dashboard/login');
  }

  return token;
}

export class AdminUnauthorizedError extends Error {
  constructor() {
    super('Admin session expired');
    this.name = 'AdminUnauthorizedError';
  }
}

/**
 * Calls an admin-protected API endpoint.
 *
 * Never cached: the dashboard shows operational data (new leads, statuses) and
 * a stale read here would be actively misleading.
 */
export async function adminFetch<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (response.status === 401) {
    throw new AdminUnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(`API ${path} responded ${response.status}`);
  }

  return (await response.json()) as T;
}

/**
 * Wrapper for dashboard pages: fetches, and on an expired token sends the
 * visitor back to the login page instead of rendering an error.
 *
 * `redirect()` works by throwing, so it is called outside the try block.
 */
export async function adminFetchOrLogin<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    return await adminFetch<T>(path, token, init);
  } catch (error) {
    if (error instanceof AdminUnauthorizedError) {
      return null;
    }

    console.error(error);
    return null;
  }
}

export function getApiUrl(): string {
  return API_URL;
}
