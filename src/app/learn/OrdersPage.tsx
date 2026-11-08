import { Link, Navigate, useParams } from 'react-router-dom';
import { CurrentCatalogOffers } from '@/components/CurrentCatalogOffers';
import { FirstOrderStageIcon } from '@/components/FirstOrderStageIcon';
import { LearningModuleStage } from '@/components/LearningModuleStage';
import {
  firstOrderModuleMeta,
  getVisibleFirstOrderStages,
  type FirstOrderStage,
} from '@/data/learning/firstOrder';
import { offerLearning, orderScenarios } from '@/data/learning/orders';
import styles from './OrdersPage.module.css';

const stages = getVisibleFirstOrderStages();

function Scenario({ id }: { id: string }) {
  const scenario = orderScenarios.find((item) => item.id === id);
  if (!scenario) return null;

  return (
    <article className={`callout ${styles.scenario}`}>
      <h3>{scenario.title}</h3>
      <p className="bodyText"><strong>Вопрос:</strong> {scenario.question}</p>
      <p className="bodyText"><strong>Разбор:</strong> {scenario.answer}</p>
    </article>
  );
}

function StarterProgramAndOffers() {
  return (
    <div className="stack">
      <div>
        <h3 className={styles.subheading}>Стартовая программа</h3>
        <p>
          Состав и требования зависят от актуальной программы и доступности для
          аккаунта. Сверяйся с официальным описанием и учитывай только те
          преимущества, условия которых подтверждены.
        </p>
      </div>
      <CurrentCatalogOffers embedded />
      <div>
        <h3 className={styles.subheading}>Как проверять предложение каталога</h3>
        <p>{offerLearning.intro}</p>
        <ul className="plain-list">
          {offerLearning.conditions.map((condition) => <li key={condition}>{condition}</li>)}
        </ul>
        <h4 className={styles.subheading}>Возможные причины, почему предложение не применилось</h4>
        <ul className="plain-list">
          {offerLearning.possibleReasons.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
        <p className={`callout callout--info ${styles.note}`}>{offerLearning.note}</p>
        <ul className="external-links">
          {offerLearning.links.map((item) => (
            <li key={item.id}>
              <a className="external-links__item" href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Scenario id="missing-gift" />
      </div>
    </div>
  );
}

function renderStageContent(stage: FirstOrderStage) {
  switch (stage.contentType) {
    case 'intro':
      return (
        <div className="stack">
          <div className="lesson-intro">
            {stage.introText?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <section className="stack" aria-labelledby="first-order-benefits-title">
            <h3 id="first-order-benefits-title" className={styles.subheading}>
              Что даёт первый заказ
            </h3>
            <ul className="plain-list">
              <li>
                Разберёшься в последовательности заказа - от выбора товаров до получения.
              </li>
              <li>
                Получишь личный опыт, на который можно опираться, объясняя процесс клиенту.
              </li>
              <li>
                Проверишь преимущества стартовой программы, если она доступна и
                соблюдены её условия.
              </li>
            </ul>
          </section>
          <StarterProgramAndOffers />
        </div>
      );
    case 'plain-text':
      return (
        <div className="lesson-intro">
          <p>
            Заказы продукции Oriflame оформляются на официальном сайте{' '}
            <a href="https://oriflame.ru/" target="_blank" rel="noopener noreferrer">
              oriflame.ru
            </a>.
          </p>
          {stage.introText?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      );
  }
}

export function OrdersPage() {
  return (
    <div className={`${styles.lesson} ${styles.stageOverview} tools-page`}>
      <Link to="/learn" className="tools-back">← К обучению</Link>
      <header className={styles.moduleHeader}>
        <h1>{firstOrderModuleMeta.title}</h1>
        <p>Пройди два этапа - от понимания первого заказа до его оформления и проверки.</p>
      </header>

      <ol className={styles.stageList} aria-label="Этапы модуля «Первый заказ»">
        {stages.map((stage) => (
          <li key={stage.id}>
            <Link to={stage.path} className={styles.stageRow}>
              <span className={styles.stageIcon}>
                <FirstOrderStageIcon name={stage.icon} />
              </span>
              <span className={styles.stageCopy}>
                <span className={styles.stageRowTitle}>{stage.title}</span>
                <span className={styles.stageRowDescription}>{stage.cardDescription}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function OrderStagePage() {
  const { stageSlug } = useParams<{ stageSlug: string }>();
  const currentIndex = stages.findIndex(
    (stage) => stage.path.split('/').pop() === stageSlug,
  );

  if (currentIndex < 0) {
    const oldOrderStageSlugs = new Set(['products', 'offers', 'delivery', 'final-check']);
    return oldOrderStageSlugs.has(stageSlug ?? '') ? (
      <Navigate to="/learn/orders/checkout" replace />
    ) : (
      <Navigate to={firstOrderModuleMeta.path} replace />
    );
  }

  const stage = stages[currentIndex];
  const previousStage = stages[currentIndex - 1];
  const nextStage = stages[currentIndex + 1];
  const paginationClass = [
    styles.stagePagination,
    !previousStage ? styles.stagePaginationFirst : '',
    !nextStage ? styles.stagePaginationLast : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${styles.lesson} tools-page`}>
      <Link to={firstOrderModuleMeta.path} className="tools-back">← К этапам</Link>

      <LearningModuleStage stage={stage}>
        {renderStageContent(stage)}
      </LearningModuleStage>

      <nav className={paginationClass} aria-label="Переход между этапами">
        {previousStage ? (
          <Link to={previousStage.path} className="btn btn--secondary">
            <span>← Предыдущий этап</span>
            <small>{previousStage.title}</small>
          </Link>
        ) : <span />}
        {nextStage ? (
          <Link to={nextStage.path} className="btn btn--primary">
            <span>Следующий этап →</span>
            <small>{nextStage.title}</small>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
