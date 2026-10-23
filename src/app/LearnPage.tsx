import { Link } from 'react-router-dom';
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer';
import { learningCatalog } from '@/data/learning/catalog';

export function LearnPage() {
  return (
    <div className="tools-page">
      <header className="home-intro">
        <p className="eyebrow">Раздел</p>
        <h1 className="home-intro__title">Обучение</h1>
        <p className="home-intro__lead">
          Материалы, которые помогают понять, как устроена работа в бизнесе
          Oriflame и как выполнять основные действия.
        </p>
      </header>

      <ul className="tools-catalog">
        {learningCatalog.map((item) => (
          <li key={item.id}>
            {item.status === 'available' && item.path ? (
              <div className="tools-card-stack">
                <Link to={item.path} className="tools-card">
                  <p className="eyebrow eyebrow--accent">Доступно</p>
                  <h2 className="tools-card__title">{item.title}</h2>
                  {item.description ? (
                    <p className="tools-card__desc">{item.description}</p>
                  ) : null}
                  <span className="tools-card__cta">Открыть</span>
                </Link>
                {item.video ? <LessonVideoPlayer video={item.video} /> : null}
              </div>
            ) : (
              <div className="tools-card tools-card--soon">
                <p className="eyebrow">В разработке</p>
                <h2 className="tools-card__title">{item.title}</h2>
                {item.description ? (
                  <p className="tools-card__desc">{item.description}</p>
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
