import type { EstimateResult, InquiryPayload } from './types';

/**
 * Base the browser calls the API on.
 *
 * Defaults to a same-origin path, not localhost. `NEXT_PUBLIC_*` values are
 * compiled into this bundle at build time, so a localhost default that slips
 * through is not a broken dev setup - it is a live site telling every visitor's
 * browser to call their own machine, which fails as an opaque CORS error. A
 * relative default is correct wherever the API is proxied under the site's own
 * domain, and merely wrong in an obvious, local way otherwise.
 *
 * Running the API on a separate port or host (local development, a dedicated
 * api.* hostname) therefore has to set NEXT_PUBLIC_API_URL explicitly - see
 * apps/web/.env.example.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // The API's validation errors carry a readable `message`; fall back to the
    // status text for anything else (a 429 from the rate limiter, say).
    let message = response.statusText;

    try {
      const payload = (await response.json()) as { message?: string | string[] };
      if (payload.message) {
        message = Array.isArray(payload.message)
          ? payload.message.join(', ')
          : payload.message;
      }
    } catch {
      // Non-JSON error body — keep the status text.
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function submitInquiry(payload: InquiryPayload) {
  return post<{ id: string | null; received: boolean }>('/inquiries', payload);
}

export function estimateCompost(payload: {
  areaFeddan: number;
  cropType: string;
  soilType: string;
  governorate?: string;
}) {
  return post<EstimateResult>('/calculator/estimate', payload);
}
