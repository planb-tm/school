import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  SUCCESS_PLAN_MODULE_ID,
  successPlanModuleMeta,
} from '@/data/success-plan-2026/module';
import { hasLearningProgress, loadProgress } from '@/lib/progress';

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

      <article className="module-teaser module-teaser--compact">
        <div className="module-teaser__body">
          <p className="eyebrow eyebrow--accent">Обучение</p>
          <h2 className="module-teaser__title">{successPlanModuleMeta.title}</h2>
          <p className="module-teaser__desc">
            Модули по маркетинг-плану и программам Oriflame - с примерами и
            проверкой знаний.
          </p>
        </div>
        <Link
          className="btn btn--primary btn--block"
          to={continueLearning ? successPlanModuleMeta.path : '/learn'}
        >
          {continueLearning ? 'Продолжить обучение' : 'Открыть обучение'}
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
    </div>
  );
}
