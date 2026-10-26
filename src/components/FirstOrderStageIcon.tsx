import type { FirstOrderStageIcon as IconName } from '@/data/learning/firstOrder';

type Props = { name: IconName; className?: string };

export function FirstOrderStageIcon({ name, className }: Props) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'box' ? (
        <>
          <path d="m12 3 8 4.4v9.2L12 21l-8-4.4V7.4L12 3Z" />
          <path d="m4.3 7.5 7.7 4.3 7.7-4.3M12 12v8.7" />
        </>
      ) : null}
      {name === 'bag' ? (
        <>
          <path d="M5 8.5h14l1 12H4l1-12Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </>
      ) : null}
      {name === 'gift' ? (
        <>
          <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
          <path d="M12 7H8.5a2 2 0 1 1 2-2c0 1.1 1.5 2 1.5 2ZM12 7h3.5a2 2 0 1 0-2-2c0 1.1-1.5 2-1.5 2Z" />
        </>
      ) : null}
      {name === 'clipboard' ? (
        <>
          <rect x="6" y="5" width="12" height="16" rx="2" />
          <path d="M9 5.5V4h6v1.5M9 10h6M9 14h6M9 18h4" />
        </>
      ) : null}
      {name === 'delivery' ? (
        <>
          <path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" />
          <circle cx="7.5" cy="18.5" r="1.5" />
          <circle cx="18" cy="18.5" r="1.5" />
        </>
      ) : null}
      {name === 'checklist' ? (
        <>
          <path d="m4 7 1.5 1.5L8 6M11 7h9M4 16l1.5 1.5L8 15M11 16h9" />
        </>
      ) : null}
    </svg>
  );
}
