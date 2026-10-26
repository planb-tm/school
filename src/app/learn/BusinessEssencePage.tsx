import { Link } from 'react-router-dom';
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer';
import {
  businessEssenceIntro,
  businessEssenceMeta,
  businessEssenceVideo,
} from '@/data/learning/businessEssence';

export function BusinessEssencePage() {
  return (
    <div className="tools-page">
      <Link to="/learn" className="tools-back">
        ← К обучению
      </Link>

      <header className="home-intro">
        <h1 className="home-intro__title">{businessEssenceMeta.title}</h1>
        <div className="lesson-intro">
          <p>{businessEssenceIntro}</p>
        </div>
      </header>

      <section className="panel panel--soft" aria-label="Видео о сути бизнеса">
        <LessonVideoPlayer video={businessEssenceVideo} />
        <a
          className="external-links__item"
          href={businessEssenceVideo.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть видео
        </a>
      </section>
    </div>
  );
}
