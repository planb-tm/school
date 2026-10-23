import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/BrandMark';
import {
  plannedModules,
  successPlanModuleMeta,
} from '@/data/success-plan-2026/module';

export function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-card" aria-labelledby="home-title">
        <div className="hero-card__brand">
          <BrandMark size="md" />
          <div className="hero-card__brand-text">
            <p id="home-title" className="hero-card__name">
              planB
            </p>
            <p className="hero-card__tag">Обучение. Инструменты. Развитие.</p>
          </div>
        </div>

        <div className="hero-card__body">
          <p className="hero-card__eyebrow">Твой следующий шаг</p>
          <h1 className="hero-card__title">
            Разберись. Попробуй. Построй своё.
          </h1>
          <p className="hero-card__lead">
            Понимай правила, осваивай инструменты и шаг за шагом развивай своё
            дело.
          </p>
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-title">Первый модуль</h2>
        <p className="muted">
          «План Б» - альтернативный путь к свободе и своему делу. Сейчас в
          приложении доступен разбор «Плана Успеха» Oriflame 2026.
        </p>

        <article className="module-teaser">
          <div className="module-teaser__body">
            <p className="eyebrow">Доступно</p>
            <h3>{successPlanModuleMeta.title}</h3>
            <p>{successPlanModuleMeta.subtitle}</p>
            <ol className="home-steps">
              <li>Введение: роль «Плана Успеха»</li>
              <li>Основные понятия</li>
              <li>Принципы расчёта бонусов</li>
              <li>Разбор контрольных примеров</li>
              <li>Самостоятельная практика</li>
              <li>Тест и источники</li>
            </ol>
          </div>
          <Link className="btn btn--primary btn--block" to={successPlanModuleMeta.path}>
            Открыть модуль
          </Link>
        </article>
      </section>

      <section className="home-section">
        <h2 className="section-title">В планах</h2>
        <p className="muted">Эти разделы ещё не готовы - не открываются.</p>
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
