export interface AppUpdateState {
  available: boolean;
  version: string | null;
}

const UPDATE_CHECK_INTERVAL_MS = 15 * 60 * 1000;
const APP_VERSION = __APP_VERSION__;
const reloadKey = `planb-update-reload-${APP_VERSION}`;

let snapshot: AppUpdateState = { available: false, version: null };
let registration: ServiceWorkerRegistration | null = null;
let lastCheckAt = 0;
let checkPromise: Promise<void> | null = null;
let reloadScheduled = false;
let activationRequested = false;
let manualActivationRequested = false;
let activatedBuildId: string | null = null;
const listeners = new Set<() => void>();
const protectedReasons = new Set<string>();
const dirtyFields = new Set<HTMLElement>();

function publish(next: AppUpdateState): void {
  if (snapshot.available === next.available && snapshot.version === next.version) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function isEditable(element: Element | null): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement
    || element instanceof HTMLSelectElement
    || (element instanceof HTMLElement && element.isContentEditable);
}

function isFieldDirty(element: HTMLElement): boolean {
  if (element instanceof HTMLInputElement) {
    if (element.type === 'checkbox' || element.type === 'radio') {
      return element.checked !== element.defaultChecked;
    }
    return element.type !== 'file' && element.value !== element.defaultValue;
  }
  if (element instanceof HTMLTextAreaElement) return element.value !== element.defaultValue;
  if (element instanceof HTMLSelectElement) {
    return Array.from(element.options).some((option) => option.selected !== option.defaultSelected);
  }
  return element.isContentEditable;
}

function hasUnsavedField(): boolean {
  for (const field of dirtyFields) {
    if (!field.isConnected || !isFieldDirty(field)) {
      dirtyFields.delete(field);
      continue;
    }
    return true;
  }
  return false;
}

function isUpdateProtected(): boolean {
  return protectedReasons.size > 0
    || isEditable(document.activeElement)
    || hasUnsavedField();
}

function reloadOnce(): void {
  if (reloadScheduled) return;
  try {
    if (sessionStorage.getItem(reloadKey) === 'done') return;
    sessionStorage.setItem(reloadKey, 'done');
  } catch {
    // A memory-only guard still prevents multiple reloads in this page.
  }
  reloadScheduled = true;
  window.location.reload();
}

function activateWaitingWorker(): void {
  const waiting = registration?.waiting;
  if (!waiting || activationRequested) return;
  activationRequested = true;
  manualActivationRequested = false;
  waiting.postMessage({ type: 'PLANB_SKIP_WAITING' });
}

function offerUpdate(version: string, isActivated = false): void {
  if (version === APP_VERSION) return;
  publish({ available: true, version });
  if (isUpdateProtected() && !manualActivationRequested) return;
  if (registration?.waiting) activateWaitingWorker();
  else if (isActivated) reloadOnce();
}

function applyAvailableUpdateIfSafe(): void {
  if (isUpdateProtected()) return;
  if (registration?.waiting) activateWaitingWorker();
  else if (snapshot.version && activatedBuildId === snapshot.version) reloadOnce();
}

function trackDirtyField(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !isEditable(target)) return;
  if (isFieldDirty(target)) dirtyFields.add(target);
  else dirtyFields.delete(target);
  if (snapshot.available) applyAvailableUpdateIfSafe();
}

function clearFormFields(event: Event): void {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  for (const field of dirtyFields) {
    if (form.contains(field)) dirtyFields.delete(field);
  }
  if (snapshot.available) applyAvailableUpdateIfSafe();
}

function reportClientVersion(worker: ServiceWorker | null | undefined = navigator.serviceWorker.controller): void {
  worker?.postMessage({ type: 'PLANB_CLIENT_VERSION', buildId: APP_VERSION });
}

function watchRegistration(nextRegistration: ServiceWorkerRegistration): void {
  registration = nextRegistration;
  const watchedWorkers = new WeakSet<ServiceWorker>();
  const watchInstallingWorker = (installing: ServiceWorker | null): void => {
    if (!installing || watchedWorkers.has(installing)) return;
    watchedWorkers.add(installing);
    installing.addEventListener('statechange', () => {
      if (installing.state === 'installed' && nextRegistration.waiting && nextRegistration.active) {
        nextRegistration.waiting.postMessage({ type: 'PLANB_GET_VERSION' });
      }
    });
  };

  nextRegistration.addEventListener('updatefound', () => {
    watchInstallingWorker(nextRegistration.installing);
  });
  watchInstallingWorker(nextRegistration.installing);

  if (nextRegistration.waiting && nextRegistration.active) {
    nextRegistration.waiting.postMessage({ type: 'PLANB_GET_VERSION' });
  }
  reportClientVersion(nextRegistration.active);
}

async function checkForUpdates(force = false): Promise<void> {
  if (!registration || !navigator.onLine || checkPromise) return checkPromise ?? Promise.resolve();
  const now = Date.now();
  if (!force && now - lastCheckAt < UPDATE_CHECK_INTERVAL_MS) return;
  lastCheckAt = now;
  checkPromise = registration.update()
    .then(() => {
      if (registration?.waiting && registration.active) {
        registration.waiting.postMessage({ type: 'PLANB_GET_VERSION' });
      }
    })
    .catch(() => undefined)
    .finally(() => { checkPromise = null; });
  return checkPromise;
}

function handleWorkerMessage(event: MessageEvent): void {
  const message = event.data as { type?: string; buildId?: unknown } | null;
  if (!message || typeof message !== 'object') return;

  if (message.type === 'PLANB_VERSION_REQUEST') {
    const target = event.source;
    if (target && 'postMessage' in target) {
      (target as ServiceWorker).postMessage({ type: 'PLANB_CLIENT_VERSION', buildId: APP_VERSION });
    }
    return;
  }

  if ((message.type === 'PLANB_UPDATE_READY' || message.type === 'PLANB_WORKER_VERSION')
    && typeof message.buildId === 'string') {
    offerUpdate(message.buildId);
    return;
  }

  if (message.type === 'PLANB_VERSION_ACTIVATED' && typeof message.buildId === 'string') {
    reportClientVersion(event.source as ServiceWorker | null);
    activationRequested = false;
    activatedBuildId = message.buildId;
    offerUpdate(message.buildId, true);
  }
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || import.meta.env.DEV) return;

  const swUrl = `${import.meta.env.BASE_URL}sw.js`;
  const register = async () => {
    try {
      const nextRegistration = await navigator.serviceWorker.register(swUrl, {
        scope: import.meta.env.BASE_URL,
        updateViaCache: 'none',
      });
      watchRegistration(nextRegistration);
      await checkForUpdates(true);
    } catch {
      // The site remains usable if Service Worker support or registration is unavailable.
    }
  };

  document.addEventListener('input', trackDirtyField, true);
  document.addEventListener('change', trackDirtyField, true);
  document.addEventListener('submit', clearFormFields, true);
  document.addEventListener('reset', clearFormFields, true);
  navigator.serviceWorker.addEventListener('message', handleWorkerMessage);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (snapshot.available) reloadOnce();
  });

  if (document.readyState === 'complete') void register();
  else window.addEventListener('load', () => void register(), { once: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void checkForUpdates();
  });
  window.addEventListener('pageshow', () => void checkForUpdates());
  window.addEventListener('online', () => void checkForUpdates(true));
}

export function subscribeToAppUpdate(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAppUpdateState(): AppUpdateState {
  return snapshot;
}

export function requestAppUpdate(): void {
  if (!snapshot.available) return;
  manualActivationRequested = true;
  if (registration?.waiting) activateWaitingWorker();
  else if (activatedBuildId === snapshot.version) reloadOnce();
}

export function setUpdateProtection(reason: string, isProtected: boolean): void {
  if (isProtected) protectedReasons.add(reason);
  else protectedReasons.delete(reason);
  if (snapshot.available) applyAvailableUpdateIfSafe();
}
