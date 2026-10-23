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
});
