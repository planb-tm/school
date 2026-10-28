import { useId, useState } from 'react';
import type { LessonVideo } from '@/types/learning';
import { resolveLessonVideoSrc } from '@/lib/lessonVideo';

type Props = {
  video: LessonVideo;
};

/**
 * Lazy lesson video: renders only for allowlisted https sources.
 * Does not autoplay; media loads after the user presses play.
 */
export function LessonVideoPlayer({ video }: Props) {
  const titleId = useId();
  const src = resolveLessonVideoSrc(video);
  const [started, setStarted] = useState(false);

  if (!src) return null;

  const label = video.title ?? 'Видео';
  const description = video.description?.trim();
  const useCircle = Boolean(video.circlePreview && video.poster);
  const isPortrait = video.aspectRatio === '9:16';
  const isSquare = video.aspectRatio === '1:1';
  const isCircular = video.shape === 'circle';
  const rootClass = [
    'lesson-video',
    useCircle ? 'lesson-video--circle' : '',
    isPortrait ? 'lesson-video--portrait' : '',
    isSquare ? 'lesson-video--square' : '',
    isCircular ? 'lesson-video--circular' : '',
    started ? 'lesson-video--playing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (!started) {
    return (
      <div className={rootClass}>
        <button
          type="button"
          className={
            useCircle
              ? 'lesson-video__poster lesson-video__poster--circle'
              : 'lesson-video__poster'
          }
          onClick={() => setStarted(true)}
          aria-describedby={titleId}
        >
          {video.poster ? (
            <img
              src={video.poster}
              alt=""
              className="lesson-video__image"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="lesson-video__placeholder" aria-hidden="true" />
          )}
          <span className="lesson-video__play" aria-hidden="true">
            ▶
          </span>
          <span className="sr-only">Воспроизвести: {label}</span>
        </button>
        <div className="lesson-video__meta">
          <p id={titleId} className="lesson-video__title">
            {label}
          </p>
          {video.duration ? (
            <p className="lesson-video__duration">{video.duration}</p>
          ) : null}
          {description ? <p className="lesson-video__alt">{description}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <div className="lesson-video__frame">
        {video.type === 'mp4' ? (
          <video
            className="lesson-video__media"
            src={src}
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={video.poster}
            title={label}
          >
            {description}
          </video>
        ) : (
          <iframe
            className="lesson-video__media"
            src={`${src}${src.includes('?') ? '&' : '?'}autoplay=1`}
            title={label}
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      {description ? <p className="lesson-video__alt">{description}</p> : null}
    </div>
  );
}
