import type {
  CalculatorOptions,
  MediaItem,
  Paginated,
  Partner,
  Product,
  Project,
  ServiceItem,
  SiteSettings,
} from './types';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

/** How long server-rendered content is cached before the API is polled again. */
const CONTENT_REVALIDATE_SECONDS = 300;

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
  searchParams?: Record<string, string | number | undefined>;
}

/**
 * Server-side fetch against the NestJS API.
 *
 * Content endpoints must never take the whole page down: a site whose API is
 * briefly unreachable should still render its shell, so callers get `null`
 * and decide what to show instead. Errors are logged server-side rather than
 * surfaced to visitors.
 */
async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  const url = new URL(`${API_URL}${path}`);

  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: {
        revalidate: options.revalidate ?? CONTENT_REVALIDATE_SECONDS,
        tags: options.tags,
      },
    });

    if (!response.ok) {
      console.error(`API ${path} responded ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`API ${path} failed:`, error);
    return null;
  }
}

export async function getSettings(): Promise<SiteSettings | null> {
  return apiFetch<SiteSettings>('/settings', { tags: ['settings'] });
}

export async function getServices(): Promise<ServiceItem[]> {
  const data = await apiFetch<Paginated<ServiceItem>>('/services', {
    searchParams: { limit: 50 },
    tags: ['services'],
  });

  return data?.items ?? [];
}

export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<Paginated<Product>>('/products', {
    searchParams: { limit: 20 },
    tags: ['products'],
  });

  return data?.items ?? [];
}

export async function getProduct(slug: string): Promise<Product | null> {
  return apiFetch<Product>(`/products/${slug}`, { tags: ['products', `product:${slug}`] });
}

export async function getProjects(): Promise<Project[]> {
  const data = await apiFetch<Paginated<Project>>('/projects', {
    searchParams: { limit: 50 },
    tags: ['projects'],
  });

  return data?.items ?? [];
}

export async function getPartners(): Promise<Partner[]> {
  const data = await apiFetch<Paginated<Partner>>('/partners', {
    searchParams: { limit: 100 },
    tags: ['partners'],
  });

  return data?.items ?? [];
}

export async function getMedia(category?: string): Promise<MediaItem[]> {
  const data = await apiFetch<Paginated<MediaItem>>('/media', {
    searchParams: { limit: 100, category },
    tags: ['media'],
  });

  return data?.items ?? [];
}

export async function getCalculatorOptions(): Promise<CalculatorOptions | null> {
  // Crop and soil tables change rarely; cache them for a day.
  return apiFetch<CalculatorOptions>('/calculator/options', {
    revalidate: 86_400,
    tags: ['calculator'],
  });
}
