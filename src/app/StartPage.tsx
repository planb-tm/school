import { Link } from 'react-router-dom';
import { learningCatalog } from '@/data/learning/catalog';
import { firstOrderStages } from '@/data/learning/firstOrder';
import { toolsCatalog } from '@/data/tools/catalog';
import { startRouteSteps } from '@/data/startRoute';
import styles from './StartPage.module.css';

const firstOrderHasDrafts = firstOrderStages.some((stage) => stage.status === 'draft');

export function StartPage() {
  return (
    <div className={`${styles.page} tools-page`}>
      <Link to="/" className="tools-back">← На главную</Link>

      <header className="home-intro">
        <p className="eyebrow eyebrow--accent">Рекомендуемый маршрут</p>
        <h1 className="home-intro__title">Начать здесь</h1>
        <p className="home-intro__lead">
          Последовательно познакомься с основными материалами planB. Это ориентир, а не обязательный курс - переходи к любому шагу напрямую.
        </p>
      </header>

      <ol className={styles.steps}>
        {startRouteSteps.map((step, index) => {
          const learningItem = step.learningItemId
            ? learningCatalog.find((item) => item.id === step.learningItemId)
            : undefined;
          const path = learningItem?.path ?? ('path' in step ? step.path : undefined);
          const status = learningItem?.status;
          const label = learningItem?.title;
          const isToolsStep = step.id === 'tools';

          return (
            <li key={step.id}>
              <article className={styles.step}>
                <span className={styles.number} aria-hidden="true">{index + 1}</span>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeading}>
                    <h2>{step.title}</h2>
                    {step.optional ? (
                      <span className={`${styles.status} ${styles.statusOptional}`}>Можно позже</span>
                    ) : status ? (
                      <span className={`${styles.status} ${status === 'available' ? styles.statusReady : styles.statusDraft}`}>
                        {status === 'available' ? 'Доступно' : 'В разработке'}
                      </span>
                    ) : null}
                  </div>

                  {learningItem ? (
                    <>
                      <p className={styles.description}>{learningItem.description}</p>
                      <p className={styles.destination}>Раздел: {label}</p>
                      {learningItem.id === 'first-order' && firstOrderHasDrafts ? (
                        <p className={styles.note}>
                          Некоторые этапы модуля ещё в разработке.
                        </p>
                      ) : null}
                    </>
                  ) : isToolsStep ? (
                    <>
                      <p className={styles.description}>
                        Эти инструменты помогут разобрать маркетинг-план и анализировать локальный Excel-отчёт команды. Шаг необязательный - открой его, когда понадобится.
                      </p>
                      <ul className={styles.resources}>
                        {toolsCatalog.map((tool) => (
                          <li key={tool.id}>
                            <strong>{tool.title}</strong>
                            {tool.description ? <span>{tool.description}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  {path ? (
                    <Link to={path} className={`btn ${isToolsStep ? 'btn--secondary' : 'btn--primary'} ${styles.action}`}>
                      {isToolsStep ? 'Открыть инструменты' : `Открыть: ${label}`}
                    </Link>
                  ) : (
                    <span className={styles.unavailable}>Материал ещё в разработке</span>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <p className={styles.catalogLink}>
        Нужен другой материал? <Link to="/learn">Открой весь каталог обучения</Link>.
      </p>
    </div>
  );
}
