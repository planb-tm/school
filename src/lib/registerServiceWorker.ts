/** Register PWA service worker (production / preview only). */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Avoid SW during Vite HMR / local SPA edits.
  if (import.meta.env.DEV) {
    return;
  }

  const swUrl = `${import.meta.env.BASE_URL}sw.js`;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl).catch(() => {
      // Installability still works if SW fails later; ignore quietly.
    });
  });
}
