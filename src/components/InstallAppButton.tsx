import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallAppButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      ('standalone' in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

    if (standalone) {
      setHidden(true);
      return;
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  if (hidden || !deferred) {
    return null;
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === 'accepted') {
      setHidden(true);
    }
  }

  return (
    <button
      type="button"
      className="install-app-btn"
      onClick={() => void install()}
      aria-label="Установить приложение на экран"
    >
      Установить
    </button>
  );
}
