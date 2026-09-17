import rateLimit, { type Options } from 'express-rate-limit';

/**
 * Rate limiting lives at the Express layer rather than in a Nest guard so it
 * runs before routing, and so it keeps working across the Nest major-version
 * upgrades that have historically lagged for @nestjs/throttler.
 *
 * NOTE for production: these counters are per container. Behind an ALB with
 * more than one task, put an AWS WAF rate-based rule in front of the API (or
 * back these limiters with Redis) if you need a global limit.
 */
function buildLimiter(overrides: Partial<Options>) {
  return rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    // The API sits behind a proxy; Express is configured with `trust proxy`
    // so `req.ip` is the real client address.
    message: {
      statusCode: 429,
      error: 'TooManyRequests',
      message: 'Too many requests - please try again shortly.',
    },
    ...overrides,
  });
}

export function createGlobalLimiter(windowMs: number, limit: number) {
  return buildLimiter({ windowMs, limit });
}

/**
 * Public write endpoints (contact forms, quote requests, login). Tight enough
 * to blunt scripted abuse without tripping up a farm office where several
 * people share one outbound IP.
 */
export function createStrictLimiter() {
  return buildLimiter({
    windowMs: 60_000,
    limit: 5,
    // Only the public writes are sensitive; admin reads on the same path
    // prefix fall back to the global limiter.
    skip: (req) => req.method !== 'POST',
  });
}
