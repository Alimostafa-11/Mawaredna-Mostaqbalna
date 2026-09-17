'use client';

import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from '@heroui/react';
import { Calculator, RotateCcw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/routing';
import { estimateCompost } from '@/lib/client-api';
import type { CalculatorOptions, EstimateResult } from '@/lib/types';
import { formatNumber, formatRange, optionLabel } from '@/lib/utils';
import { InquiryForm } from './inquiry-form';
import { Notice } from '../ui/notice';

interface CalculatorFormProps {
  options: CalculatorOptions;
}

/**
 * "حاسبة احتياج المزرعة".
 *
 * The estimate itself is computed by the API rather than here, so the
 * agronomic rate table lives in one place and can be tuned without shipping a
 * new frontend build.
 */
export function CalculatorForm({ options }: CalculatorFormProps) {
  const t = useTranslations('calculator');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;

  const [cropType, setCropType] = useState<string>(options.crops[0]?.key ?? '');
  const [soilType, setSoilType] = useState<string>(options.soils[1]?.key ?? '');
  const [governorate, setGovernorate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const raw = new FormData(event.currentTarget).get('areaFeddan');
    const areaFeddan = Number(raw);

    if (!Number.isFinite(areaFeddan) || areaFeddan <= 0) {
      setErrors({ areaFeddan: t('errorArea') });
      return;
    }

    if (!cropType || !soilType) {
      setErrors({ areaFeddan: t('errorSelect') });
      return;
    }

    setIsPending(true);

    try {
      const estimate = await estimateCompost({
        areaFeddan,
        cropType,
        soilType,
        governorate: governorate || undefined,
      });

      setResult(estimate);
      setShowQuoteForm(false);
    } catch {
      setErrors({ areaFeddan: t('errorGeneric') });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Card>
        <Card.Header>
          <Card.Title>{t('title')}</Card.Title>
          <Card.Description>{t('subtitle')}</Card.Description>
        </Card.Header>

        <Card.Content>
          <Form
            onSubmit={onSubmit}
            validationErrors={errors}
            className="flex flex-col gap-5"
          >
            <TextField name="areaFeddan" isRequired fullWidth>
              <Label>{t('area')}</Label>
              <Input
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.1"
                dir="ltr"
                placeholder={t('areaPlaceholder')}
              />
              <FieldError />
            </TextField>

            <Select
              selectedKey={cropType}
              onSelectionChange={(key) => setCropType(String(key))}
              fullWidth
            >
              <Label>{t('crop')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {options.crops.map((crop) => (
                    <ListBox.Item
                      key={crop.key}
                      id={crop.key}
                      textValue={optionLabel(crop, locale)}
                    >
                      {optionLabel(crop, locale)}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              selectedKey={soilType}
              onSelectionChange={(key) => setSoilType(String(key))}
              fullWidth
            >
              <Label>{t('soil')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {options.soils.map((soil) => (
                    <ListBox.Item
                      key={soil.key}
                      id={soil.key}
                      textValue={optionLabel(soil, locale)}
                    >
                      {optionLabel(soil, locale)}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              selectedKey={governorate || null}
              onSelectionChange={(key) => setGovernorate(key ? String(key) : '')}
              fullWidth
            >
              <Label>
                {t('governorate')}{' '}
                <span className="text-[var(--muted)]">({tCommon('optional')})</span>
              </Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {options.governorates.map((item) => (
                    <ListBox.Item
                      key={item.key}
                      id={item.key}
                      textValue={optionLabel(item, locale)}
                    >
                      {optionLabel(item, locale)}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            <Button type="submit" isDisabled={isPending} size="lg">
              <Calculator aria-hidden className="size-4" />
              {isPending ? tCommon('loading') : tCommon('calculate')}
            </Button>
          </Form>
        </Card.Content>
      </Card>

      <div className="flex flex-col gap-6">
        {result ? (
          <>
            <Card>
              <Card.Header>
                <Card.Title>{t('resultTitle')}</Card.Title>
              </Card.Header>

              <Card.Content>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <ResultTile
                    label={t('resultTons')}
                    value={formatRange(result.tons.min, result.tons.max, locale)}
                    unit={t('ton')}
                    emphasis
                  />
                  <ResultTile
                    label={t('resultCubicMeters')}
                    value={formatRange(
                      result.cubicMeters.min,
                      result.cubicMeters.max,
                      locale,
                    )}
                    unit={t('cubicMeter')}
                  />
                  <ResultTile
                    label={t('resultPerFeddan')}
                    value={formatRange(
                      result.perFeddan.tonsMin,
                      result.perFeddan.tonsMax,
                      locale,
                    )}
                    unit={t('tonPerFeddan')}
                  />
                  <ResultTile
                    label={t('resultBags')}
                    value={formatRange(
                      result.bags50kg.min,
                      result.bags50kg.max,
                      locale,
                    )}
                    unit={t('bag')}
                  />
                </dl>

                <p className="mt-5 text-sm text-[var(--muted)]">
                  {locale === 'ar' ? result.basis.cropLabelAr : result.basis.cropLabelEn}
                  {' · '}
                  {locale === 'ar' ? result.basis.soilLabelAr : result.basis.soilLabelEn}
                  {' · '}
                  {formatNumber(result.input.areaFeddan, locale)}{' '}
                  {locale === 'ar' ? 'فدان' : 'feddan'}
                </p>
              </Card.Content>

              <Card.Footer className="flex flex-wrap gap-3">
                <Button onPress={() => setShowQuoteForm((value) => !value)}>
                  {t('requestQuoteCta')}
                </Button>
                <Button variant="ghost" onPress={() => setResult(null)}>
                  <RotateCcw aria-hidden className="size-4" />
                  {t('recalculate')}
                </Button>
              </Card.Footer>
            </Card>

            <Notice>
              {locale === 'ar' ? result.disclaimerAr : result.disclaimerEn}
            </Notice>

            {showQuoteForm && (
              <Card>
                <Card.Header>
                  <Card.Title>{t('requestQuoteCta')}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <InquiryForm
                    defaultType="quote"
                    lockType
                    source="/calculator"
                    governorates={options.governorates}
                    calculation={{
                      areaFeddan: result.input.areaFeddan,
                      cropType: result.input.cropType,
                      soilType: result.input.soilType,
                      estimatedTonsMin: result.tons.min,
                      estimatedTonsMax: result.tons.max,
                      estimatedCubicMetersMin: result.cubicMeters.min,
                      estimatedCubicMetersMax: result.cubicMeters.max,
                    }}
                  />
                </Card.Content>
              </Card>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
            <Calculator
              aria-hidden
              className="mx-auto size-10 text-[var(--muted)] opacity-50"
            />
            <p className="mt-4 text-sm text-[var(--muted)]">{t('subtitle')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultTile({
  label,
  value,
  unit,
  emphasis = false,
}: {
  label: string;
  value: string;
  unit: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        emphasis
          ? 'border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/50'
          : 'border-[var(--border)]'
      }`}
    >
      <dt className="text-xs text-[var(--muted)]">{label}</dt>
      <dd className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-xl font-bold tabular">{value}</span>
        <span className="text-sm text-[var(--muted)]">{unit}</span>
      </dd>
    </div>
  );
}
