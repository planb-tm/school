import { Link } from 'react-router-dom';
import { learningCatalog } from '@/data/learning/catalog';

export function LearnPage() {
  return (
    <div className="tools-page">
      <header className="home-intro">
        <p className="eyebrow">Раздел</p>
        <h1 className="home-intro__title">Обучение</h1>
      </header>

      <ul className="tools-catalog">
        {learningCatalog.map((mod) => (
          <li key={mod.id}>
            {mod.status === 'available' ? (
              <Link to={mod.path} className="tools-card">
                <p className="eyebrow eyebrow--accent">Доступно</p>
                <h2 className="tools-card__title">{mod.title}</h2>
                {mod.description ? (
                  <p className="tools-card__desc">{mod.description}</p>
                ) : null}
                <span className="tools-card__cta">Открыть</span>
              </Link>
            ) : (
              <div className="tools-card tools-card--soon">
                <p className="eyebrow">Скоро</p>
                <h2 className="tools-card__title">{mod.title}</h2>
                {mod.description ? (
                  <p className="tools-card__desc">{mod.description}</p>
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
