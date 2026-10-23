import { Link, NavLink } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand" aria-label="planB - на главную">
          <BrandMark size="sm" />
          <span className="brand__name">planB</span>
        </Link>
        <div className="app-header__actions">
          <nav className="app-header__nav" aria-label="Главная навигация">
            <NavLink to="/" end className="nav-link nav-link--home">
              Главная
            </NavLink>
            <NavLink to="/modules/success-plan-2026" className="nav-link">
              Модуль
            </NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
