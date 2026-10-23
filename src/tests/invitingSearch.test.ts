import { describe, expect, it } from 'vitest';
import { applyPlaceholders, findPlaceholders } from '@/lib/copyText';
import { matchesQuery } from '@/lib/invitingSearch';
import { invitationTemplates, objectionItems } from '@/data/learning/inviting';

describe('inviting search and placeholders', () => {
  it('matches russian substrings across fields', () => {
    expect(matchesQuery('пирамида', ['Это финансовая пирамида'])).toBe(true);
    expect(matchesQuery('маркет', ['каталог', 'маркетплейс'])).toBe(true);
    expect(matchesQuery('xyz', ['привет'])).toBe(false);
  });

  it('keeps invitation templates data-driven', () => {
    expect(invitationTemplates.length).toBeGreaterThanOrEqual(9);
    expect(
      invitationTemplates.every((item) => item.text.length > 0 && item.id),
    ).toBe(true);
  });

  it('keeps objection answers data-driven', () => {
    expect(objectionItems.length).toBe(24);
    expect(
      objectionItems.every(
        (item) => item.answer.length > 0 && item.why.length > 0,
      ),
    ).toBe(true);
  });

  it('blocks unresolved placeholders until filled', () => {
    const text =
      'Вот моя реферальная ссылка: [ТВОЯ_РЕФЕРАЛЬНАЯ_ССЫЛКА]';
    expect(findPlaceholders(text)).toEqual(['[ТВОЯ_РЕФЕРАЛЬНАЯ_ССЫЛКА]']);
    expect(
      applyPlaceholders(text, {
        '[ТВОЯ_РЕФЕРАЛЬНАЯ_ССЫЛКА]': 'https://example.com/ref',
      }),
    ).toBe('Вот моя реферальная ссылка: https://example.com/ref');
  });
});
