import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { AppUpdateNotice } from './AppUpdateNotice';

function isVisible(element: HTMLElement): boolean {
  return element.isConnected
    && element.getClientRects().length > 0
    && !element.closest('[hidden], [inert], [aria-hidden="true"]')
    && window.getComputedStyle(element).visibility !== 'hidden';
}

export function AppShell() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef(new Map<string, { left: number; top: number }>([
    [location.key, { left: 0, top: 0 }],
  ]));
  const currentPage = useRef({ key: location.key, ready: false });

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const rememberScroll = () => {
      const page = currentPage.current;
      if (!page.ready) return;
      scrollPositions.current.set(page.key, { left: window.scrollX, top: window.scrollY });
    };

    const freezeOutgoingPage = () => {
      const page = currentPage.current;
      if (!page.ready) return;
      scrollPositions.current.set(page.key, { left: window.scrollX, top: window.scrollY });
      page.ready = false;
    };

    const freezeForInternalLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target instanceof Element
        ? event.target.closest('a[href]')
        : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download')) return;
      const target = anchor.getAttribute('target');
      if (target && target.toLowerCase() !== '_self') return;

      let destination: URL;
      try { destination = new URL(anchor.href, window.location.href); } catch { return; }
      if (destination.origin !== window.location.origin
        || (destination.protocol !== 'http:' && destination.protocol !== 'https:')) return;
      if (destination.pathname === window.location.pathname
        && destination.search === window.location.search
        && destination.hash === window.location.hash) return;

      freezeOutgoingPage();
    };

    window.addEventListener('scroll', rememberScroll, { passive: true });
    window.addEventListener('click', freezeForInternalLink, true);
    window.addEventListener('popstate', freezeOutgoingPage, true);

    return () => {
      window.removeEventListener('scroll', rememberScroll);
      window.removeEventListener('click', freezeForInternalLink, true);
      window.removeEventListener('popstate', freezeOutgoingPage, true);
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    currentPage.current = { key: location.key, ready: false };
    let disposed = false;

    const restorePage = () => {
      if (disposed || currentPage.current.key !== location.key) return false;

      const page = Array.from(main.querySelectorAll<HTMLElement>('.page-container[data-route-key]'))
        .find((container) => container.dataset.routeKey === location.key && isVisible(container));
      const heading = page?.querySelector<HTMLElement>('h1');
      if (!page || !heading || !isVisible(heading)) return false;

      if (navigationType === 'POP') {
        const saved = scrollPositions.current.get(location.key) ?? { left: 0, top: 0 };
        window.scrollTo({ ...saved, behavior: 'instant' });
      } else {
        let anchor: HTMLElement | null = null;
        if (location.hash) {
          try {
            const anchorId = decodeURIComponent(location.hash.slice(1));
            anchor = Array.from(page.querySelectorAll<HTMLElement>('[id]'))
              .find((element) => element.id === anchorId && isVisible(element)) ?? null;
          } catch { /* Invalid fragment. */ }
        }
        if (anchor) anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
        else window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
      scrollPositions.current.set(location.key, { left: window.scrollX, top: window.scrollY });
      currentPage.current.ready = true;
      return true;
    };

    const observer = new MutationObserver(() => {
      if (restorePage()) observer.disconnect();
    });
    if (!restorePage()) {
      observer.observe(main, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-route-key', 'style', 'hidden', 'aria-hidden', 'inert'],
      });
    }

    return () => {
      disposed = true;
      observer.disconnect();
      if (currentPage.current.key === location.key) currentPage.current.ready = false;
    };
  }, [location.key, location.hash, navigationType]);

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main" ref={mainRef}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          Материалы не заменяют официальный кабинет Oriflame и актуальные
          правила компании.
        </p>
        <p className="app-version">planB · версия {__APP_VERSION__}</p>
      </footer>
      <AppUpdateNotice />
      <BottomNav />
    </div>
  );
}
