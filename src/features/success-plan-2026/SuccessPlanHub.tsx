import { Link, Navigate, useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { successPlanModuleMeta } from '@/data/success-plan-2026/module';
import { isModuleSectionId, MODULE_SECTIONS, sectionPath } from './sectionsConfig';

export function SuccessPlanHub() {
  const location = useLocation();
  const hash = location.hash.replace('#', '');

  if (hash && isModuleSectionId(hash)) {
    return <Navigate to={sectionPath(hash)} replace />;
  }

  return (
    <PageContainer variant="standard" className="module-page">
      <PageHeader
        backTo="/tools"
        eyebrow="Инструмент"
        title={successPlanModuleMeta.title}
        description="Как устроен маркетинг-план Oriflame: основные понятия, принципы расчёта бонусов и разбор примеров."
      />

      <section className="panel" aria-label="Разделы модуля">
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
    </PageContainer>
  );
}
