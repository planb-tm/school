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

  it('accepts same-origin MP4 assets and rejects protocol-relative paths', () => {
    expect(
      resolveLessonVideoSrc({
        type: 'mp4',
        url: '/school/media/orders/why-first-order.mp4',
      }),
    ).toBe('/school/media/orders/why-first-order.mp4');
    expect(
      resolveLessonVideoSrc({ type: 'mp4', url: '//cdn.example.com/video.mp4' }),
    ).toBeNull();
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
});

