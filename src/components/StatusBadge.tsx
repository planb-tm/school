import type { VerificationStatus } from '@/types/learning';

const LABELS: Record<VerificationStatus, { short: string; full: string; hint: string }> = {
  verified: {
    short: 'Сверено',
    full: 'Сверено с документом',
    hint: 'Формулировка или цифры сверены со страницей источника.',
  },
  needs_review: {
    short: 'Сверить',
    full: 'Требует сверки',
    hint: 'Документ есть, но полная сверка ещё не завершена. Не считайте это окончательным правилом.',
  },
  outdated: {
    short: 'Устарело',
    full: 'Устарело',
    hint: 'Источник устарел относительно текущей программы.',
  },
};

export function StatusBadge({
  status,
  compact = false,
}: {
  status: VerificationStatus;
  compact?: boolean;
}) {
  const meta = LABELS[status];
  return (
    <span
      className={`status-badge status-badge--${status}${compact ? ' status-badge--compact' : ''}`}
      title={meta.hint}
    >
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__label">
        {compact ? meta.short : meta.full}
      </span>
    </span>
  );
}

export function StatusLegend() {
  return (
    <div className="status-legend" role="note">
      <p className="status-legend__title">Статусы проверки</p>
      <ul className="status-legend__list">
        {(Object.keys(LABELS) as VerificationStatus[]).map((status) => (
          <li key={status}>
            <StatusBadge status={status} />
            <span>{LABELS[status].hint}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
