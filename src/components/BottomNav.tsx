import { NavLink } from 'react-router-dom';
import { IconHome, IconLearn, IconTools } from './Icons';

const ITEMS = [
  { to: '/', end: true, label: 'Главная', icon: IconHome },
  {
    to: '/modules/success-plan-2026',
    end: false,
    label: 'Обучение',
    icon: IconLearn,
  },
  { to: '/tools', end: false, label: 'Инструменты', icon: IconTools },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      <div className="bottom-nav__inner">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? 'bottom-nav__link bottom-nav__link--active'
                  : 'bottom-nav__link'
              }
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
