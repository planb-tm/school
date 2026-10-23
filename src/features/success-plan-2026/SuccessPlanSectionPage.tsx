import { useEffect } from 'react';
import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom';
import { SectionNav } from '@/components/SectionNav';
import {
  MODULE_BASE,
  isModuleSectionId,
  nextSectionId,
  prevSectionId,
  sectionPath,
} from './sectionsConfig';
import type { SuccessPlanRouteContext } from './SuccessPlanLayout';
import { OverviewSection } from './OverviewSection';
import { ConceptsSection } from './ConceptsSection';
import { BonusStepsSection } from './BonusStepsSection';
import { ExamplesSection } from './ExamplesSection';
import { TryYourselfSection } from './TryYourselfSection';
import { QuizSection } from './QuizSection';
import { SourcesSection } from './SourcesSection';

export function SuccessPlanSectionPage() {
  const { sectionId = '' } = useParams();
  const { progress, setProgress, resetProgress, navSections } =
    useOutletContext<SuccessPlanRouteContext>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sectionId]);

  if (!isModuleSectionId(sectionId)) {
    return <Navigate to={MODULE_BASE} replace />;
  }

  const prevId = prevSectionId(sectionId);
  const nextId = nextSectionId(sectionId);

  return (
    <div className="module-page">
      <div className="module-section-toolbar">
        <Link to={MODULE_BASE} className="btn btn--ghost btn--back">
          ← К оглавлению модуля
        </Link>
      </div>

      <div className="module-sticky">
        <SectionNav sections={navSections} />
      </div>

      <div className="module-sections">
        {sectionId === 'overview' ? <OverviewSection /> : null}
        {sectionId === 'concepts' ? <ConceptsSection /> : null}
        {sectionId === 'bonus-steps' ? <BonusStepsSection /> : null}
        {sectionId === 'examples' ? <ExamplesSection /> : null}
        {sectionId === 'try' ? (
          <TryYourselfSection
            progress={progress}
            onProgressChange={setProgress}
          />
        ) : null}
        {sectionId === 'quiz' ? (
          <QuizSection progress={progress} onProgressChange={setProgress} />
        ) : null}
        {sectionId === 'sources' ? <SourcesSection /> : null}
      </div>

      <nav className="module-pager" aria-label="Соседние разделы">
        {prevId ? (
          <Link to={sectionPath(prevId)} className="btn btn--secondary">
            ← Назад
          </Link>
        ) : (
          <Link to={MODULE_BASE} className="btn btn--secondary">
            ← К оглавлению
          </Link>
        )}
        {nextId ? (
          <Link to={sectionPath(nextId)} className="btn btn--primary">
            Следующий раздел →
          </Link>
        ) : (
          <Link to={MODULE_BASE} className="btn btn--primary">
            К оглавлению
          </Link>
        )}
      </nav>

      <div className="module-footer-actions">
        <button type="button" className="btn btn--ghost" onClick={resetProgress}>
          Сбросить локальный прогресс
        </button>
      </div>
    </div>
  );
}
