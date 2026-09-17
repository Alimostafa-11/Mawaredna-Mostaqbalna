'use client';

import { Button } from '@heroui/react';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignOutButton() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      // Clears the cached server render that assumed a session.
      router.replace('/dashboard/login');
      router.refresh();
    }
  }

  return (
    <Button variant="outline" size="sm" onPress={signOut} isDisabled={isPending}>
      <LogOut aria-hidden className="size-4" />
      {t('signOut')}
    </Button>
  );
}
