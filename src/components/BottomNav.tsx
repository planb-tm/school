import { NavLink, useLocation } from 'react-router-dom';
import { IconHome, IconLearn, IconTools } from './Icons';

const ITEMS = [
  {
    id: 'home',
    to: '/',
    end: true,
    label: 'Главная',
    icon: IconHome,
    isActive: (pathname: string) => pathname === '/',
  },
  {
    id: 'learn',
    to: '/learn',
    end: false,
    label: 'Обучение',
    icon: IconLearn,
    isActive: (pathname: string) =>
      pathname === '/learn' || pathname.startsWith('/learn/'),
  },
  {
    id: 'tools',
    to: '/tools',
    end: false,
    label: 'Инструменты',
    icon: IconTools,
    isActive: (pathname: string) =>
      pathname.startsWith('/tools') || pathname.startsWith('/modules/'),
  },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      <div className="bottom-nav__inner">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname);
          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              className={
                active
                  ? 'bottom-nav__link bottom-nav__link--active'
                  : 'bottom-nav__link'
              }
              aria-current={active ? 'page' : undefined}
            >
              <span className="bottom-nav__icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className="bottom-nav__label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
