import { Link, NavLink, useLocation } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { InstallAppButton } from './InstallAppButton';
import { ThemeToggle } from './ThemeToggle';

const DESKTOP_NAV = [
  { to: '/', end: true, label: 'Главная' },
  { to: '/tools', end: false, label: 'Инструменты' },
] as const;

export function AppHeader() {
  const location = useLocation();

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
                isActive ||
                (item.to === '/' && location.pathname.startsWith('/learn/')) ||
                (item.to === '/tools' && location.pathname.startsWith('/modules/'))
                  ? 'app-header__nav-link app-header__nav-link--active'
                  : 'app-header__nav-link'
              }
              aria-current={
                (item.to === '/' && location.pathname.startsWith('/learn/')) ||
                (item.to === '/tools' && location.pathname.startsWith('/modules/'))
                  ? 'page'
                  : undefined
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-header__actions">
          <InstallAppButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
