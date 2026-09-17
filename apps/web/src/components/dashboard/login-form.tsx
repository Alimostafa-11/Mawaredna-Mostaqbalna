'use client';

import {
  Alert,
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export function LoginForm() {
  const t = useTranslations('dashboard');
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') ?? '').trim(),
          password: String(form.get('password') ?? ''),
        }),
      });

      if (!response.ok) {
        // The API's login limiter answers 429; say so rather than implying the
        // password was wrong.
        setError(
          response.status === 429
            ? t('loginRateLimited')
            : response.status >= 500
              ? t('loginUnreachable')
              : t('loginError'),
        );
        return;
      }

      // The session cookie is set by the route handler, so refresh to let the
      // server components re-render with it.
      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError(t('loginUnreachable'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-5">
      {error && (
        <Alert status="danger">
          <Alert.Content>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <TextField name="email" isRequired fullWidth>
        <Label>{t('email')}</Label>
        <Input
          type="email"
          dir="ltr"
          autoComplete="username"
          autoFocus
          placeholder="admin@mawaredna.com"
        />
        <FieldError />
      </TextField>

      <TextField name="password" isRequired fullWidth>
        <Label>{t('password')}</Label>
        <Input type="password" dir="ltr" autoComplete="current-password" />
        <FieldError />
      </TextField>

      <Button type="submit" size="lg" isDisabled={isSubmitting} fullWidth>
        <LogIn aria-hidden className="size-4" />
        {isSubmitting ? t('leads.saving') : t('signIn')}
      </Button>
    </Form>
  );
}
