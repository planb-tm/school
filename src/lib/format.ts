const numberRu = new Intl.NumberFormat('ru-RU');

export function formatNumber(value: number): string {
  return numberRu.format(value);
}

export function formatRub(value: number): string {
  return `${formatNumber(Math.round(value))} ₽`;
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function formatBb(value: number): string {
  return `${formatNumber(value)} ББ`;
}
