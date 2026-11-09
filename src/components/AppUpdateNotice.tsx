import { useSyncExternalStore } from 'react';
import {
  getAppUpdateState,
  requestAppUpdate,
  subscribeToAppUpdate,
} from '@/lib/appUpdate';

export function AppUpdateNotice() {
  const update = useSyncExternalStore(subscribeToAppUpdate, getAppUpdateState, getAppUpdateState);
  if (!update.available) return null;

  return (
    <aside className="app-update-notice" role="status" aria-live="polite">
      <span>Доступна новая версия planB</span>
      <button type="button" onClick={requestAppUpdate}>
        Обновить
      </button>
    </aside>
  );
}
