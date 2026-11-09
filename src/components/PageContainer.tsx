import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  children: ReactNode;
  variant?: 'standard' | 'reading' | 'workspace';
  className?: string;
};

export function PageContainer({ children, variant = 'standard', className = '' }: Props) {
  const location = useLocation();

  return (
    <div
      className={`page-container page-container--${variant} ${className}`.trim()}
      data-route-key={location.key}
    >
      {children}
    </div>
  );
}
