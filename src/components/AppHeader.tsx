import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HOME_HELP_ID } from '@/components/home/HelpEntry';
import { BrandMark } from './BrandMark';
import { InstallAppButton } from './InstallAppButton';
import { ThemeToggle } from './ThemeToggle';

const DESKTOP_NAV = [
  { to: '/', end: true, label: 'Главная' },
  { to: '/learn', end: false, label: 'Обучение' },
  { to: '/tools', end: false, label: 'Инструменты' },
] as const;

export function AppHeader() {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: globalThis.MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  function openHelp(event: ReactMouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setMenuOpen(false);

    if (location.pathname === '/' || location.pathname === '') {
      if (location.hash !== `#${HOME_HELP_ID}`) {
        navigate({ pathname: '/', hash: HOME_HELP_ID }, { replace: false });
      } else {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById(HOME_HELP_ID)?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
        document.getElementById(HOME_HELP_ID)?.focus({ preventScroll: true });
      }
      return;
    }

    navigate({ pathname: '/', hash: HOME_HELP_ID });
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand" aria-label="planB - на главную">
          <BrandMark size="sm" />
          <span className="brand__name">planB</span>
        </Link>

        <nav className="app-header__nav" aria-label="Основные разделы">
          {DESKTOP_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? 'app-header__nav-link app-header__nav-link--active'
                  : 'app-header__nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-header__actions">
          <InstallAppButton />
          <ThemeToggle />

          <div className="app-header__menu" ref={menuRef}>
            <button
              type="button"
              className="app-header__menu-btn"
              aria-label="Дополнительное меню"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true">···</span>
            </button>
            {menuOpen ? (
              <div id={menuId} className="app-header__menu-panel" role="menu">
                <a
                  href={`#${HOME_HELP_ID}`}
                  role="menuitem"
                  className="app-header__menu-item"
                  onClick={openHelp}
                >
                  Помощь
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
