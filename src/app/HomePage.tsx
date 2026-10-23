import { Link } from 'react-router-dom';
import { successPlanModuleMeta } from '@/data/success-plan-2026/module';
import { toolsCatalog } from '@/data/tools/catalog';

const infoSheetTool = toolsCatalog.find((tool) => tool.id === 'info-sheet');

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-intro">
        <p className="home-intro__eyebrow">
          planB · РАБОЧЕЕ ПРОСТРАНСТВО КОМАНДЫ
        </p>
        <h1 className="home-intro__title">Обучение и инструменты</h1>
        <p className="home-intro__lead">
          Материалы и инструменты для работы с продуктами, маркетинг-планом и
          структурой команды Oriflame.
        </p>
      </header>

      <article className="module-teaser module-teaser--compact">
        <div className="module-teaser__body">
          <p className="eyebrow eyebrow--accent">Обучение</p>
          <h2 className="module-teaser__title">План Успеха 2026</h2>
          <p className="module-teaser__desc">
            Разбор маркетинг-плана: понятия, условия, принципы расчёта бонусов и
            практические примеры.
          </p>
        </div>
        <Link
          className="btn btn--primary btn--block"
          to={successPlanModuleMeta.path}
        >
          Открыть модуль
        </Link>
      </article>

      <article className="module-teaser module-teaser--compact">
        <div className="module-teaser__body">
          <p className="eyebrow eyebrow--accent">Инструменты</p>
          <h2 className="module-teaser__title">
            {infoSheetTool?.title ?? 'Визуализатор информационного листка'}
          </h2>
          <p className="module-teaser__desc">
            Просмотр и анализ структуры команды на основе информационного листка
            Excel.
          </p>
        </div>
        <Link
          className="btn btn--secondary btn--block"
          to={infoSheetTool?.path ?? '/tools/info-sheet'}
        >
          Открыть инструмент
        </Link>
      </article>
    </div>
  );
}
