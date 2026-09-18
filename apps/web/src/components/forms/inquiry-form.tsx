'use client';

import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
  toast,
} from '@heroui/react';
import { Send } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import { submitInquiry } from '@/lib/client-api';
import type { InquiryPayload, InquiryType } from '@/lib/types';
import { optionLabel } from '@/lib/utils';

/** Mirrors the request types the API accepts. */
const INQUIRY_TYPES: InquiryType[] = [
  'compost-supply',
  'farm-quantities',
  'waste-collection',
  'waste-processing',
  'project-study',
  'partnership',
  'general',
];

interface InquiryFormProps {
  /** Preselected request type, e.g. the sugarcane page opens on collection. */
  defaultType?: InquiryType;
  /** Governorate options, served by the API so the list stays editable. */
  governorates?: readonly { key: string; labelAr: string; labelEn: string }[];
  /** Attached to a quote request coming from the farm calculator. */
  calculation?: InquiryPayload['calculation'];
  /** Recorded with the lead for attribution. */
  source?: string;
  /** Hides the type selector when the page already fixes the request type. */
  lockType?: boolean;
}

export function InquiryForm({
  defaultType = 'general',
  governorates = [],
  calculation,
  source,
  lockType = false,
}: InquiryFormProps) {
  const t = useTranslations('requests');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  const [type, setType] = useState<InquiryType>(defaultType);
  const [governorate, setGovernorate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Built inside the component so messages follow the active locale.
  const schema = z.object({
    name: z.string().trim().min(2, t('validation.name')),
    phone: z
      .string()
      .trim()
      .regex(/^(\+?2)?0?1[0125]\d{8}$|^(\+?2)?0?\d{2,3}\d{6,8}$/, t('validation.phone')),
    email: z.union([z.literal(''), z.email(t('validation.email'))]).optional(),
    company: z.string().trim().max(160).optional(),
    center: z.string().trim().max(80).optional(),
    message: z.string().trim().max(4000).optional(),
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const form = new FormData(event.currentTarget);
    const parsed = schema.safeParse({
      name: form.get('name'),
      phone: form.get('phone'),
      email: form.get('email') || '',
      company: form.get('company') || '',
      message: form.get('message') || '',
      center: form.get('center') || '',
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitInquiry({
        ...parsed.data,
        email: parsed.data.email || undefined,
        company: parsed.data.company || undefined,
        center: parsed.data.center || undefined,
        message: parsed.data.message || undefined,
        governorate: governorate || undefined,
        type,
        locale,
        source,
        calculation,
        // Honeypot: real people never see this field.
        website: String(form.get('website') ?? ''),
      });

      setIsDone(true);
      toast.success(t('success'));
    } catch {
      toast.danger(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isDone) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center dark:border-brand-800 dark:bg-brand-950/50">
        <p className="text-base font-medium text-brand-800 dark:text-brand-200">
          {t('success')}
        </p>
        <Button className="mt-5" variant="secondary" onPress={() => setIsDone(false)}>
          {tCommon('reset')}
        </Button>
      </div>
    );
  }

  return (
    <Form onSubmit={onSubmit} validationErrors={errors} className="flex flex-col gap-5">
      {/* Honeypot. Hidden from sight and from assistive tech, but present in
          the DOM for scripted submitters to fill in. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" isRequired fullWidth>
          <Label>{t('fields.name')}</Label>
          <Input placeholder={t('fields.name')} autoComplete="name" />
          <FieldError />
        </TextField>

        <TextField name="phone" isRequired fullWidth>
          <Label>{t('fields.phone')}</Label>
          <Input
            type="tel"
            inputMode="tel"
            dir="ltr"
            placeholder="01xxxxxxxxx"
            autoComplete="tel"
          />
          <FieldError />
        </TextField>

        <TextField name="email" fullWidth>
          <Label>
            {t('fields.email')}{' '}
            <span className="text-[var(--muted)]">({tCommon('optional')})</span>
          </Label>
          <Input type="email" dir="ltr" autoComplete="email" />
          <FieldError />
        </TextField>

        <TextField name="company" fullWidth>
          <Label>
            {t('fields.company')}{' '}
            <span className="text-[var(--muted)]">({tCommon('optional')})</span>
          </Label>
          <Input autoComplete="organization" />
          <FieldError />
        </TextField>
        
        <TextField name="center" fullWidth>
          <Label>
            {t('fields.center')}{' '}
            <span className="text-[var(--muted)]">({tCommon('optional')})</span>
          </Label>
          <Input autoComplete="organization" />
          <FieldError />
        </TextField>

        {!lockType && (
          <Select
            selectedKey={type}
            onSelectionChange={(key) => setType(key as InquiryType)}
            fullWidth
          >
            <Label>{t('fields.type')}</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {INQUIRY_TYPES.map((value) => (
                  <ListBox.Item key={value} id={value} textValue={t(`types.${value}`)}>
                    {t(`types.${value}`)}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}

        {governorates.length > 0 && (
          <Select
            selectedKey={governorate || null}
            onSelectionChange={(key) => setGovernorate(key ? String(key) : '')}
            fullWidth
          >
            <Label>
              {t('fields.governorate')}{' '}
              <span className="text-[var(--muted)]">({tCommon('optional')})</span>
            </Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {governorates.map((option) => (
                  <ListBox.Item
                    key={option.key}
                    id={option.key}
                    textValue={optionLabel(option, locale)}
                  >
                    {optionLabel(option, locale)}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      </div>

      <TextField name="message" fullWidth>
        <Label>{t('fields.message')}</Label>
        <TextArea rows={5} placeholder={t('fields.messagePlaceholder')} />
        <FieldError />
      </TextField>

      <p className="text-xs text-[var(--muted)]">{t('privacyNote')}</p>

      <Button type="submit" isDisabled={isSubmitting} size="lg" className="sm:self-start">
        <Send aria-hidden className="size-4" />
        {isSubmitting ? tCommon('submitting') : tCommon('submit')}
      </Button>
    </Form>
  );
}
