import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  plannedModules,
  SUCCESS_PLAN_MODULE_ID,
  successPlanModuleMeta,
} from '@/data/success-plan-2026/module';
import { hasLearningProgress, loadProgress } from '@/lib/progress';

const MODULE_TOPICS = [
  'Основные понятия',
  'Принципы расчёта',
  'Практические примеры',
  'Проверка знаний',
] as const;

export function HomePage() {
  const continueLearning = useMemo(() => {
    return hasLearningProgress(loadProgress(SUCCESS_PLAN_MODULE_ID));
  }, []);

  return (
    <div className="home-page">
      <header className="home-intro">
        <p className="eyebrow">Учебный центр</p>
        <h1 className="home-intro__title">Обучение и инструменты команды</h1>
        <p className="home-intro__lead">
          Изучай продукты, правила и программы Oriflame, разбирай практические
          примеры и проверяй свои знания.
        </p>
      </header>

      <article className="module-teaser">
        <div className="module-teaser__body">
          <p className="eyebrow eyebrow--accent">Доступно</p>
          <h2 className="module-teaser__title">{successPlanModuleMeta.title}</h2>
          <p className="module-teaser__desc">
            Как устроен маркетинг-план Oriflame: основные понятия, принципы
            расчёта бонусов и разбор примеров.
          </p>
          <ul className="module-teaser__topics">
            {MODULE_TOPICS.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
        <Link
          className="btn btn--primary btn--block"
          to={successPlanModuleMeta.path}
        >
          {continueLearning ? 'Продолжить обучение' : 'Начать обучение'}
        </Link>
      </article>

      <article className="module-teaser module-teaser--compact">
        <div className="module-teaser__body">
          <p className="eyebrow eyebrow--accent">Инструменты</p>
          <h2 className="module-teaser__title">
            Визуализатор информационного листка
          </h2>
        </div>
        <Link className="btn btn--secondary btn--block" to="/tools">
          Открыть инструменты
        </Link>
      </article>

      <section className="home-section" aria-labelledby="planned-title">
        <h2 id="planned-title" className="section-title">
          В планах
        </h2>
        <p className="muted home-section__note">
          Эти разделы ещё не готовы - пока не открываются.
        </p>
        <ul className="planned-list">
          {plannedModules.map((mod) => (
            <li key={mod.id}>
              <span>{mod.title}</span>
              <span className="status-badge status-badge--needs_review status-badge--compact">
                <span className="status-badge__dot" aria-hidden="true" />
                <span className="status-badge__label">Скоро</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
