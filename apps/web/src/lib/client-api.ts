import type { EstimateResult, InquiryPayload } from './types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

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
