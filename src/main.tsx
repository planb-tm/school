import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router';
import { registerServiceWorker } from '@/lib/registerServiceWorker';
import { applyTheme, resolveTheme } from '@/lib/theme';
import '@/styles/global.css';

applyTheme(resolveTheme());
registerServiceWorker();

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
);
