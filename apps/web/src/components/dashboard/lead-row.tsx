'use client';

import { Button, Disclosure, Label, TextArea, TextField, toast } from '@heroui/react';
import { Building2, Mail, MapPin, Phone, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { defaultLocale } from '@/i18n/routing';
import { INQUIRY_STATUSES, type Inquiry, type InquiryStatus } from '@/lib/admin-types';
import { formatDateTime, formatRange, telHref, whatsappHref } from '@/lib/utils';
import { LeadStatusBadge } from './lead-status-badge';

/**
 * One lead, collapsed to a summary row and expandable to the full record.
 *
 * Status and notes are written through `/bff/admin/*`, which attaches the
 * session token server-side — the browser never holds it.
 */
export function LeadRow({ lead }: { lead: Inquiry }) {
  const t = useTranslations('dashboard');
  const tTypes = useTranslations('requests.types');
  const router = useRouter();

  const [status, setStatus] = useState<InquiryStatus>(lead.status);
  const [notes, setNotes] = useState(lead.internalNotes ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = status !== lead.status || notes !== (lead.internalNotes ?? '');

  async function save() {
    setIsSaving(true);

    try {
      const response = await fetch(`/bff/admin/inquiries/${lead._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNotes: notes }),
      });

      if (!response.ok) throw new Error(String(response.status));

      toast.success(t('leads.saved'));
      // Re-renders the server component so the list reflects the new status.
      router.refresh();
    } catch {
      toast.danger(t('leads.saveError'));
    } finally {
      setIsSaving(false);
    }
  }

  const calc = lead.calculation;
  const hasEstimate =
    calc?.estimatedTonsMin !== undefined && calc?.estimatedTonsMax !== undefined;

  return (
    <li className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <Disclosure>
        <Disclosure.Heading>
          <Disclosure.Trigger className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-4 text-start">
          <span className="font-medium">{lead.name}</span>

          <span className="text-sm text-[var(--muted)]" dir="ltr">
            {lead.phone}
          </span>

          <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs">
            {tTypes(lead.type)}
          </span>

          <LeadStatusBadge status={lead.status} />

          <span className="ms-auto text-xs text-[var(--muted)]">
            {formatDateTime(lead.createdAt, defaultLocale)}
          </span>
          </Disclosure.Trigger>
        </Disclosure.Heading>

        <Disclosure.Content>
          <div className="flex flex-col gap-6 border-t border-[var(--border)] p-5">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Detail icon={<Phone aria-hidden className="size-4" />} label={t('leads.phone')}>
                <a href={telHref(lead.phone)} className="hover:text-brand-600" dir="ltr">
                  {lead.phone}
                </a>
                {' · '}
                <a
                  href={whatsappHref(lead.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600"
                >
                  WhatsApp
                </a>
              </Detail>

              {lead.email && (
                <Detail icon={<Mail aria-hidden className="size-4" />} label={t('leads.email')}>
                  <a href={`mailto:${lead.email}`} className="hover:text-brand-600" dir="ltr">
                    {lead.email}
                  </a>
                </Detail>
              )}

              {lead.company && (
                <Detail
                  icon={<Building2 aria-hidden className="size-4" />}
                  label={t('leads.company')}
                >
                  {lead.company}
                </Detail>
              )}

              {lead.governorate && (
                <Detail
                  icon={<MapPin aria-hidden className="size-4" />}
                  label={t('leads.governorate')}
                >
                  {lead.governorate}
                </Detail>
              )}

              {lead.center && (
                <Detail
                  icon={<MapPin aria-hidden className="size-4" />}
                  label={t('leads.center')}
                >
                  {lead.center}
                </Detail>
              )}
            </dl>

            {lead.message && (
              <div>
                <h3 className="text-sm font-semibold">{t('leads.message')}</h3>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
                  {lead.message}
                </p>
              </div>
            )}

            {calc && (
              <div className="rounded-xl border border-[var(--border)] bg-surface-secondary p-4">
                <h3 className="text-sm font-semibold">{t('leads.calculation')}</h3>
                <p className="mt-1.5 text-sm text-[var(--muted)]">
                  {calc.areaFeddan !== undefined && (
                    <>
                      {t('leads.area')}: {calc.areaFeddan} {t('leads.feddan')}
                    </>
                  )}
                  {hasEstimate && (
                    <>
                      {' · '}
                      {t('leads.estimated')}:{' '}
                      {formatRange(
                        calc.estimatedTonsMin as number,
                        calc.estimatedTonsMax as number,
                        defaultLocale,
                      )}{' '}
                      {t('leads.ton')}
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor={`status-${lead._id}`}>{t('leads.status')}</Label>
                <select
                  id={`status-${lead._id}`}
                  value={status}
                  onChange={(event) => setStatus(event.target.value as InquiryStatus)}
                  className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--field-background)] px-3 py-2 text-sm"
                >
                  {INQUIRY_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {t(`statuses.${value}`)}
                    </option>
                  ))}
                </select>
              </div>

              <TextField value={notes} onChange={setNotes} fullWidth>
                <Label>{t('leads.notes')}</Label>
                <TextArea rows={3} placeholder={t('leads.notesPlaceholder')} />
              </TextField>
            </div>

            <Button
              onPress={save}
              isDisabled={isSaving || !isDirty}
              className="sm:self-start"
            >
              <Save aria-hidden className="size-4" />
              {isSaving ? t('leads.saving') : t('leads.save')}
            </Button>
          </div>
        </Disclosure.Content>
      </Disclosure>
    </li>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
