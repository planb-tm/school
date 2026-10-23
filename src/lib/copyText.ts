/** Copy plain text to the clipboard with a textarea fallback. */
export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

const PLACEHOLDER_RE = /\[[^\]\n]+\]/g;

/** Finds unfinished placeholders like [ТВОЯ_РЕФЕРАЛЬНАЯ_ССЫЛКА]. */
export function findPlaceholders(text: string): string[] {
  const found = text.match(PLACEHOLDER_RE) ?? [];
  return [...new Set(found)];
}

export function applyPlaceholders(
  text: string,
  values: Record<string, string>,
): string {
  return text.replace(PLACEHOLDER_RE, (token) => {
    const value = values[token]?.trim();
    return value && value.length > 0 ? value : token;
  });
}
