import type { CSSProperties, ReactNode } from 'react';

type IconProps = {
  className?: string | undefined;
  size?: number | undefined;
  strokeWidth?: number | undefined;
  style?: CSSProperties | undefined;
};

function Svg({
  className = '',
  size = 20,
  style,
  children,
}: {
  className?: string | undefined;
  size?: number | undefined;
  style?: CSSProperties | undefined;
  children: ReactNode;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      {children}
    </svg>
  );
}

function s(sw = 1.75) {
  return {
    stroke: 'currentColor' as const,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

export function IconLayoutDashboard({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" {...s(strokeWidth)} />
      <rect x="13" y="3" width="8" height="5" rx="1.5" {...s(strokeWidth)} />
      <rect x="13" y="10" width="8" height="11" rx="1.5" {...s(strokeWidth)} />
      <rect x="3" y="13" width="8" height="8" rx="1.5" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconUsers({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...s(strokeWidth)} />
      <circle cx="9" cy="7" r="3" {...s(strokeWidth)} />
      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a3 3 0 0 1 0 5.74"
        {...s(strokeWidth)}
      />
    </Svg>
  );
}

export function IconNetwork({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <circle cx="12" cy="5" r="2.5" {...s(strokeWidth)} />
      <circle cx="5" cy="19" r="2.5" {...s(strokeWidth)} />
      <circle cx="19" cy="19" r="2.5" {...s(strokeWidth)} />
      <path d="M12 7.5v4.5M12 12l-5.5 4.5M12 12l5.5 4.5" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconUserRound({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <circle cx="12" cy="8" r="3.5" {...s(strokeWidth)} />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconRefresh({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" {...s(strokeWidth)} />
      <path d="M21 3v6h-6" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconEraser({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path
        d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"
        {...s(strokeWidth)}
      />
      <path d="M22 21H7" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconUpload({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M12 16V4M8 8l4-4 4 4" {...s(strokeWidth)} />
      <path
        d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        {...s(strokeWidth)}
      />
    </Svg>
  );
}

export function IconSearch({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <circle cx="11" cy="11" r="6.5" {...s(strokeWidth)} />
      <path d="m16 16 4.5 4.5" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconHelpCircle({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <circle cx="12" cy="12" r="9" {...s(strokeWidth)} />
      <path
        d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.25c-.7.4-1.1.9-1.1 1.75V14"
        {...s(strokeWidth)}
      />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconChevronDown({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="m6 9 6 6 6-6" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconChevronRight({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="m9 6 6 6-6 6" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconCopy({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <rect x="8" y="8" width="12" height="12" rx="2" {...s(strokeWidth)} />
      <path
        d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        {...s(strokeWidth)}
      />
    </Svg>
  );
}

export function IconMessageCircle({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path
        d="M7.5 18.5 4 21V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7.5Z"
        {...s(strokeWidth)}
      />
    </Svg>
  );
}

export function IconPhone({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path
        d="M8.5 4.5h2.2l1 3.2-1.6 1.1a12 12 0 0 0 5.1 5.1l1.1-1.6 3.2 1v2.2a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.7a2 2 0 0 1 2-2.2Z"
        {...s(strokeWidth)}
      />
    </Svg>
  );
}

export function IconSend({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M4 11.5 20 4l-5.5 16-2.7-6.3L4 11.5Z" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconActivity({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M3 12h4l2.5-6 4 12 2.5-6H21" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconBookOpen({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path
        d="M12 6.5C10 5 7.5 4.5 4.5 5v12.5c3-1 5.5-.5 7.5 1"
        {...s(strokeWidth)}
      />
      <path
        d="M12 6.5c2-1.5 4.5-2 7.5-1.5V17.5c-3-1-5.5-.5-7.5 1"
        {...s(strokeWidth)}
      />
    </Svg>
  );
}

export function IconArrowLeft({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M19 12H5M11 6l-6 6 6 6" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconMail({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" {...s(strokeWidth)} />
      <path d="m4.5 7.5 7.5 6 7.5-6" {...s(strokeWidth)} />
    </Svg>
  );
}

export function IconHome({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path
        d="M4.5 10.5 12 4l7.5 6.5V20a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20v-9.5Z"
        {...s(strokeWidth)}
      />
    </Svg>
  );
}

export function IconList({
  size = 20,
  className = '',
  strokeWidth,
  style,
}: IconProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M8 7h12M8 12h12M8 17h12" {...s(strokeWidth)} />
      <circle cx="4.5" cy="7" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="17" r="1" fill="currentColor" />
    </Svg>
  );
}
