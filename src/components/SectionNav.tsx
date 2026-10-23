import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export interface SectionLink {
  id: string;
  label: string;
  to: string;
}

export function SectionNav({
  sections,
}: {
  sections: SectionLink[];
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) return;
    active.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [pathname]);

  return (
    <nav className="section-nav" aria-label="Разделы модуля">
      <ul ref={listRef} className="section-nav__list">
        {sections.map((section) => (
          <li key={section.id}>
            <NavLink
              to={section.to}
              className={({ isActive }) =>
                isActive
                  ? 'section-nav__btn section-nav__btn--active'
                  : 'section-nav__btn'
              }
            >
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
