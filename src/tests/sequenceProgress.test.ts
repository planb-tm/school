import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createEmptyProgress,
  hasLearningProgress,
  loadSequenceProgress,
  saveProgress,
  saveSequenceProgress,
} from '@/lib/progress';

function installLocalStorage() {
  const entries = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
    removeItem: (key: string) => entries.delete(key),
    clear: () => entries.clear(),
    key: (index: number) => [...entries.keys()][index] ?? null,
    get length() { return entries.size; },
  } satisfies Storage);
  return entries;
}

afterEach(() => vi.unstubAllGlobals());

describe('Сохранение шага обучения', () => {
  it('сохраняет текущий шаг и состояние завершения в прогрессе модуля', () => {
    installLocalStorage();
    saveProgress({
      ...createEmptyProgress('first-order'),
      completedTaskIds: ['intro'],
    });

    saveSequenceProgress('first-order', 'order-walkthrough', {
      stepIndex: 6,
      completed: false,
    });

    expect(loadSequenceProgress('first-order', 'order-walkthrough', 14)).toEqual({
      stepIndex: 6,
      completed: false,
    });
    expect(hasLearningProgress({
      ...createEmptyProgress('first-order'),
      sequenceProgress: { 'order-walkthrough': { stepIndex: 6, completed: false } },
    })).toBe(true);
  });

  it('игнорирует сохранённый индекс за пределами текущего числа шагов', () => {
    installLocalStorage();
    saveSequenceProgress('first-order', 'order-walkthrough', {
      stepIndex: 13,
      completed: true,
    });

    expect(loadSequenceProgress('first-order', 'order-walkthrough', 10)).toBeNull();
  });
});
