import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  clearBrowserReportTraces,
  FORBIDDEN_STORAGE_KEYS_PREFIX,
} from '../../features/info-sheet/utils/clearSession';

describe('privacy', () => {
  const g = globalThis as typeof globalThis & {
    window?: Window & typeof globalThis;
  };
  let previousWindow: typeof g.window;

  beforeEach(() => {
    previousWindow = g.window;
  });

  afterEach(() => {
    if (previousWindow === undefined) {
      Reflect.deleteProperty(g, 'window');
    } else {
      g.window = previousWindow;
    }
  });

  it('documents forbidden storage key prefix for report payloads', () => {
    expect(FORBIDDEN_STORAGE_KEYS_PREFIX).toBe('oriflame-report');
  });

  it('strips query and hash that could leak identifiers from URL', () => {
    const replaceState = vi.fn();
    g.window = {
      location: {
        pathname: '/school/tools/info-sheet',
        search: '?partner=100&name=Root',
        hash: '#card-100',
      },
      history: { replaceState },
    } as unknown as Window & typeof globalThis;

    clearBrowserReportTraces();
    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/school/tools/info-sheet',
    );
  });
});
