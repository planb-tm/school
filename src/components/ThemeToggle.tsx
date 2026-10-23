import { useEffect, useState } from 'react';
import {
  applyTheme,
  persistTheme,
  resolveTheme,
  type ThemeMode,
} from '@/lib/theme';
import { IconMoon, IconSun } from './Icons';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => resolveTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggle() {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    persistTheme(next);
  }

  const nextLabel = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={nextLabel}
      title={nextLabel}
    >
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  );
}
