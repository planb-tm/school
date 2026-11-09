import { Link } from 'react-router-dom';
import { toolsCatalog } from '@/data/tools/catalog';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';

export function ToolsPage() {
  return (
    <PageContainer>
      <PageHeader title="Инструменты" />

      <ul className="tools-catalog">
        {toolsCatalog.map((tool) => (
          <li key={tool.id}>
            {tool.status === 'available' ? (
              <Link to={tool.path} className="tools-card">
                <h2 className="tools-card__title">{tool.title}</h2>
                {tool.description ? (
                  <p className="tools-card__desc">{tool.description}</p>
                ) : null}
                <span className="tools-card__cta">Открыть</span>
              </Link>
            ) : (
              <div className="tools-card tools-card--soon">
                <h2 className="tools-card__title">{tool.title}</h2>
                {tool.description ? (
                  <p className="tools-card__desc">{tool.description}</p>
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
