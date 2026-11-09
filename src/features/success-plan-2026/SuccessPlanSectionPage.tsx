import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { SectionNav } from '@/components/SectionNav';
import {
  MODULE_BASE,
  isModuleSectionId,
  type ModuleSectionId,
} from './sectionsConfig';
import type { SuccessPlanRouteContext } from './SuccessPlanLayout';
import { OverviewSection } from './OverviewSection';
import { ConceptsSection } from './ConceptsSection';
import { BonusStepsSection } from './BonusStepsSection';
import { ExamplesSection } from './ExamplesSection';
import { TryYourselfSection } from './TryYourselfSection';
import { QuizSection } from './QuizSection';
import { SourcesSection } from './SourcesSection';

const SECTION_HEADERS: Record<ModuleSectionId, { title: string; description: string }> = {
  overview: {
    title: 'Введение',
    description: 'Что такое План Успеха и зачем сначала освоить основы',
  },
  concepts: {
    title: 'Основные понятия',
    description: 'В каждой карточке одно и то же устройство: простое объяснение → официальное правило → пример → ограничения → источник.',
  },
  'bonus-steps': {
    title: 'Принципы расчёта бонусов',
    description: 'Пять шагов из документа (с. 21) и таблица уровней.',
  },
  examples: {
    title: 'Разбор контрольных примеров',
    description: 'Два контрольных примера из «Плана Успеха» 2026. Открывайте шаги по одному - так проще увидеть промежуточные суммы.',
  },
  try: {
    title: 'Самостоятельная практика',
    description: 'Меняйте входные значения. Ниже - учебный результат и разбор вычислений. Это не официальный расчёт кабинета.',
  },
  quiz: {
    title: 'Тест',
    description: 'После каждого ответа сразу видно, верно ли, и почему. Ответы хранятся только на этом устройстве.',
  },
  sources: {
    title: 'Источники и ограничения',
    description: 'Официальные PDF - в docs/sources. Статус показывает, что уже сверено для обучения, а что ещё нельзя считать полностью проверенным.',
  },
};

export function SuccessPlanSectionPage() {
  const { sectionId = '' } = useParams();
  const { progress, setProgress, resetProgress, navSections } =
    useOutletContext<SuccessPlanRouteContext>();

  if (!isModuleSectionId(sectionId)) {
    return <Navigate to={MODULE_BASE} replace />;
  }

  return (
    <PageContainer variant="standard" className="module-page">
      <PageHeader
        backTo={MODULE_BASE}
        title={SECTION_HEADERS[sectionId].title}
        description={SECTION_HEADERS[sectionId].description}
      />

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

      <div className="module-footer-actions">
        <button type="button" className="btn btn--ghost" onClick={resetProgress}>
          Сбросить локальный прогресс
        </button>
      </div>
    </PageContainer>
  );
}
