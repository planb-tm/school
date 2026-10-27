import { describe, expect, it } from 'vitest';
import { resolveLessonVideoSrc } from '@/lib/lessonVideo';

describe('resolveLessonVideoSrc', () => {
  it('rejects non-https and unknown hosts', () => {
    expect(
      resolveLessonVideoSrc({ type: 'mp4', url: 'http://example.com/a.mp4' }),
    ).toBeNull();
    expect(
      resolveLessonVideoSrc({
        type: 'embed',
        url: 'https://evil.example/embed/1',
      }),
    ).toBeNull();
  });

  it('accepts https mp4 urls', () => {
    expect(
      resolveLessonVideoSrc({
        type: 'mp4',
        url: 'https://cdn.example.com/lesson.mp4',
      }),
    ).toBe('https://cdn.example.com/lesson.mp4');
  });

  it('normalizes youtube watch links to nocookie embed', () => {
    expect(
      resolveLessonVideoSrc({
        type: 'embed',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
    ).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0');
  });

  it('builds kinescope embed urls', () => {
    expect(
      resolveLessonVideoSrc({
        type: 'embed',
        url: 'https://kinescope.io/87pANSt571Np3CPcvdZc1d',
      }),
    ).toBe('https://kinescope.io/embed/87pANSt571Np3CPcvdZc1d');
  });

  it('builds the supplied first-order Kinescope embed URL', () => {
    expect(
      resolveLessonVideoSrc({
        type: 'embed',
        url: 'https://kinescope.io/5dNj1xN4vQ67g3prZPVe5Y',
      }),
    ).toBe('https://kinescope.io/embed/5dNj1xN4vQ67g3prZPVe5Y');
  });
});

