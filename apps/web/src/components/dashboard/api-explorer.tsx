'use client';

import { Button, Label } from '@heroui/react';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/**
 * Runs admin-protected GET calls through `/api/admin/*` and shows the raw
 * JSON.
 *
 * Read-only on purpose: an accidental DELETE from a convenience tool is not a
 * mistake worth enabling. Writes go through the dashboard's own screens, or
 * Swagger when something ad-hoc is genuinely needed.
 */
const ENDPOINTS = [
  { path: 'auth/me', label: 'auth/me' },
  { path: 'inquiries/stats', label: 'inquiries/stats' },
  { path: 'inquiries?limit=20', label: 'inquiries' },
  { path: 'settings', label: 'settings' },
  { path: 'services?limit=50', label: 'services' },
  { path: 'products?limit=20', label: 'products' },
  { path: 'projects?limit=50', label: 'projects' },
  { path: 'partners?limit=100', label: 'partners' },
  { path: 'media?limit=100', label: 'media' },
  { path: 'calculator/options', label: 'calculator/options' },
  { path: 'health', label: 'health' },
] as const;

export function ApiExplorer() {
  const t = useTranslations('dashboard');

  const [selected, setSelected] = useState<string>(ENDPOINTS[1].path);
  const [status, setStatus] = useState<number | null>(null);
  const [body, setBody] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function run() {
    setIsRunning(true);
    setBody(null);
    setStatus(null);

    try {
      const response = await fetch(`/api/admin/${selected}`, {
        headers: { Accept: 'application/json' },
      });

      setStatus(response.status);

      const text = await response.text();

      try {
        setBody(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setBody(text);
      }
    } catch (error) {
      setStatus(0);
      setBody(String(error));
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="min-w-64 flex-1">
          <Label htmlFor="api-endpoint">{t('api.endpoint')}</Label>
          <select
            id="api-endpoint"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            dir="ltr"
            className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--field-background)] px-3 py-2 font-mono text-sm"
          >
            {ENDPOINTS.map((endpoint) => (
              <option key={endpoint.path} value={endpoint.path}>
                GET /{endpoint.label}
              </option>
            ))}
          </select>
        </div>

        <Button onPress={run} isDisabled={isRunning}>
          <Play aria-hidden className="size-4" />
          {isRunning ? t('api.running') : t('api.run')}
        </Button>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
          <h2 className="text-sm font-semibold">{t('api.response')}</h2>
          {status !== null && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status >= 200 && status < 300
                  ? 'bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
              }`}
            >
              {t('api.status')}: {status}
            </span>
          )}
        </div>

        {body === null ? (
          <p className="p-6 text-sm text-[var(--muted)]">{t('api.selectEndpoint')}</p>
        ) : (
          <pre
            dir="ltr"
            className="max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed"
          >
            <code>{body}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
