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
    const listBounds = list.getBoundingClientRect();
    const activeBounds = active.getBoundingClientRect();
    if (activeBounds.left >= listBounds.left && activeBounds.right <= listBounds.right) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({
      left: list.scrollLeft + activeBounds.left - listBounds.left
        - (list.clientWidth - activeBounds.width) / 2,
      behavior: reducedMotion ? 'auto' : 'smooth',
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
