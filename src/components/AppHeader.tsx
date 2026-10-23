import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { InstallAppButton } from './InstallAppButton';
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
          <InstallAppButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
