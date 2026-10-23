/** Shared numeric input checks for educational calculators. */

export type ParseNumberResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

export function parseNonNegativeNumber(
  raw: string | number,
  fieldLabel: string,
): ParseNumberResult {
  const value = typeof raw === 'number' ? raw : Number(raw);

  if (raw === '' || (typeof raw === 'string' && raw.trim() === '')) {
    return { ok: false, error: `Укажите ${fieldLabel}.` };
  }

  if (!Number.isFinite(value)) {
    return { ok: false, error: `${fieldLabel}: введите число.` };
  }

  if (value < 0) {
    return { ok: false, error: `${fieldLabel} не может быть отрицательным.` };
  }

  return { ok: true, value };
}

export function parsePositiveInteger(
  raw: string | number,
  fieldLabel: string,
  options?: { min?: number; max?: number },
): ParseNumberResult {
  const parsed = parseNonNegativeNumber(raw, fieldLabel);
  if (!parsed.ok) return parsed;

  const { value } = parsed;
  if (!Number.isInteger(value)) {
    return { ok: false, error: `${fieldLabel}: нужно целое число.` };
  }

  const min = options?.min ?? 1;
  if (value < min) {
    return { ok: false, error: `${fieldLabel}: минимум ${min}.` };
  }

  if (options?.max !== undefined && value > options.max) {
    return { ok: false, error: `${fieldLabel}: максимум ${options.max}.` };
  }

  return { ok: true, value };
}
