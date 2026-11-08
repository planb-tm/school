import { Link, useLocation } from 'react-router-dom';
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer';
import {
  businessEssenceMeta,
  businessEssenceVideo,
} from '@/data/learning/businessEssence';

export function BusinessEssencePage() {
  const location = useLocation();
  const fromHome = location.state?.from === 'home';

  return (
    <div className="tools-page">
      <Link to={fromHome ? '/' : '/learn'} className="tools-back">
        {fromHome ? '← На главную' : '← К обучению'}
      </Link>

      <header className="home-intro">
        <h1 className="home-intro__title">{businessEssenceMeta.title}</h1>
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
