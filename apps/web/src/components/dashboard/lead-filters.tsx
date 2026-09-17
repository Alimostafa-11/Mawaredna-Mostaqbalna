'use client';

import { Button, Input, Label, TextField } from '@heroui/react';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { INQUIRY_STATUSES, INQUIRY_TYPES } from '@/lib/admin-types';

interface LeadFiltersProps {
  status: string;
  type: string;
  q: string;
}

/**
 * Writes the filters into the query string and lets the server component
 * re-fetch, rather than filtering an already-loaded page in the browser. With
 * a growing lead table the server is the only place that can filter honestly.
 */
export function LeadFilters({ status, type, q }: LeadFiltersProps) {
  const t = useTranslations('dashboard');
  const tTypes = useTranslations('requests.types');
  const router = useRouter();

  const [search, setSearch] = useState(q);

  function apply(next: { status?: string; type?: string; q?: string }) {
    const params = new URLSearchParams();
    const merged = { status, type, q: search, ...next };

    if (merged.status) params.set('status', merged.status);
    if (merged.type) params.set('type', merged.type);
    if (merged.q) params.set('q', merged.q);

    const query = params.toString();
    router.push(query ? `/dashboard/leads?${query}` : '/dashboard/leads');
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply({ q: search });
  }

  const hasFilters = Boolean(status || type || q);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="filter-status">{t('leads.filterStatus')}</Label>
          <select
            id="filter-status"
            value={status}
            onChange={(event) => apply({ status: event.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--field-background)] px-3 py-2 text-sm"
          >
            <option value="">{t('statuses.all')}</option>
            {INQUIRY_STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(`statuses.${value}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="filter-type">{t('leads.filterType')}</Label>
          <select
            id="filter-type"
            value={type}
            onChange={(event) => apply({ type: event.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--field-background)] px-3 py-2 text-sm"
          >
            <option value="">{t('statuses.all')}</option>
            {INQUIRY_TYPES.map((value) => (
              <option key={value} value={value}>
                {tTypes(value)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={onSearch} className="flex items-end gap-2">
        <TextField
          value={search}
          onChange={setSearch}
          fullWidth
          className="flex-1"
          aria-label={t('leads.search')}
        >
          <Label>{t('leads.search')}</Label>
          <Input placeholder={t('leads.search')} />
        </TextField>

        <Button type="submit" variant="secondary">
          <Search aria-hidden className="size-4" />
          {t('leads.searchAction')}
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            onPress={() => {
              setSearch('');
              router.push('/dashboard/leads');
            }}
          >
            <X aria-hidden className="size-4" />
            {t('leads.clear')}
          </Button>
        )}
      </form>
    </div>
  );
}
