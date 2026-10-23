import { Link } from 'react-router-dom';
import { toolsCatalog } from '@/data/tools/catalog';

export function ToolsPage() {
  return (
    <div className="tools-page">
      <header className="home-intro">
        <p className="eyebrow">Раздел</p>
        <h1 className="home-intro__title">Инструменты</h1>
        <p className="home-intro__lead">
          Практические помощники для работы со структурой и отчётами. Каждый
          инструмент открывается отдельно и не меняет модули обучения.
        </p>
      </header>

      <ul className="tools-catalog">
        {toolsCatalog.map((tool) => (
          <li key={tool.id}>
            {tool.status === 'available' ? (
              <Link to={tool.path} className="tools-card">
                <p className="eyebrow eyebrow--accent">Доступно</p>
                <h2 className="tools-card__title">{tool.title}</h2>
                <p className="tools-card__desc">{tool.description}</p>
                <span className="tools-card__cta">Открыть</span>
              </Link>
            ) : (
              <div className="tools-card tools-card--soon">
                <p className="eyebrow">Скоро</p>
                <h2 className="tools-card__title">{tool.title}</h2>
                <p className="tools-card__desc">{tool.description}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
