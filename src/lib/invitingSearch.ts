function normalize(value: string): string {
  return value.toLocaleLowerCase('ru-RU').trim();
}

/** Simple substring search across selected text fields. */
export function matchesQuery(query: string, fields: Array<string | undefined>): boolean {
  const q = normalize(query);
  if (!q) return true;
  return fields.some((field) => field != null && normalize(field).includes(q));
}
