import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function PageBackLink({ to, label = 'Назад' }: { to: string; label?: string }) {
  return (
    <Link to={to} className="tools-back">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m10 5-7 7 7 7M3 12h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}

type Props = {
  title: string;
  backTo?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  id?: string;
  className?: string;
};

export function PageHeader({ title, backTo, description, eyebrow, actions, id, className = '' }: Props) {
  return (
    <header className={`page-header ${className}`.trim()}>
      {backTo ? <PageBackLink to={backTo} /> : null}
      <div className="page-header__row">
        <div className="page-header__copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 id={id} className="page-header__title" tabIndex={-1}>{title}</h1>
          {description ? <p className="page-header__description">{description}</p> : null}
        </div>
        {actions ? <div className="page-header__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
