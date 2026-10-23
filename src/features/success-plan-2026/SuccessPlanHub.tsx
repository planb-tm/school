import { Link, Navigate, useLocation } from 'react-router-dom';
import { successPlanModuleMeta } from '@/data/success-plan-2026/module';
import { isModuleSectionId, MODULE_SECTIONS, sectionPath } from './sectionsConfig';

export function SuccessPlanHub() {
  const location = useLocation();
  const hash = location.hash.replace('#', '');

  if (hash && isModuleSectionId(hash)) {
    return <Navigate to={sectionPath(hash)} replace />;
  }

  return (
    <div className="module-page">
      <header className="module-hero">
        <p className="eyebrow">Модуль</p>
        <h1 className="page-title">{successPlanModuleMeta.title}</h1>
        <p className="lead">{successPlanModuleMeta.subtitle}</p>
      </header>

      <section className="panel" aria-label="Разделы модуля">
        <header className="panel__header">
          <h2>Разделы</h2>
          <p>Открывай по одному - так проще вернуться к оглавлению модуля.</p>
        </header>
        <ol className="module-toc">
          {MODULE_SECTIONS.map((section, index) => (
            <li key={section.id}>
              <Link to={sectionPath(section.id)} className="module-toc__link">
                <span className="module-toc__num" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="module-toc__text">
                  <span className="module-toc__label">{section.label}</span>
                  <span className="module-toc__hint">{section.hint}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
