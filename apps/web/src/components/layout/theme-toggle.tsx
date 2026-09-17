'use client';

import { Button } from '@heroui/react';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'mawaredna-theme';

/**
 * The theme lives on the root element's `data-theme` attribute, which is where
 * HeroUI reads it from. That makes the DOM the source of truth rather than
 * React state, so the toggle subscribes to it with `useSyncExternalStore`
 * instead of copying it into state inside an effect.
 *
 * During SSR the snapshot is "light"; `ThemeScript` applies the stored choice
 * before first paint, and hydration picks it up from the attribute.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export function ThemeToggle() {
  const t = useTranslations('common');
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle('dark', next === 'dark');

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing or blocked storage: the toggle still works for this
      // page view, it just will not be remembered.
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      isIconOnly
      onPress={toggle}
      aria-label={t('toggleTheme')}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'dark' ? (
        <Sun aria-hidden className="size-4" />
      ) : (
        <Moon aria-hidden className="size-4" />
      )}
    </Button>
  );
}

/**
 * Inlined in <head> so the stored theme is applied before first paint. Without
 * it a dark-mode visitor sees a white flash on every navigation.
 */
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
