import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CurrentCatalogOffers } from '@/components/CurrentCatalogOffers';
import { FirstOrderStageIcon } from '@/components/FirstOrderStageIcon';
import { LearningModuleStage } from '@/components/LearningModuleStage';
import { LearningStepSequence } from '@/components/LearningStepSequence';
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer';
import {
  firstOrderModuleMeta,
  getVisibleFirstOrderStages,
  type FirstOrderStage,
} from '@/data/learning/firstOrder';
import {
  productCategories,
  productsIntro,
  productsOutro,
} from '@/data/learning/products';
import {
  offerLearning,
  orderFinalChecklist,
  orderFinalNotice,
  orderOfficialLinks,
  orderScenarios,
  orderStepSequences,
} from '@/data/learning/orders';
import styles from './OrdersPage.module.css';

const stages = getVisibleFirstOrderStages();
const sequenceById = new Map(orderStepSequences.map((sequence) => [sequence.id, sequence]));

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

function ProductIntroduction() {
  return (
    <div className="stack">
      <div className="lesson-intro">
        {productsIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="info-list">
        {productCategories.map((category) => (
          <article className="info-list__item" key={category.id}>
            <h3 className="info-list__title">{category.title}</h3>
            <p className="info-list__desc">{category.description}</p>
          </article>
        ))}
      </div>
      <p>{productsOutro.text}</p>
      <ul className="external-links">
        {productsOutro.links.map((item) => (
          <li key={item.id}>
            <a className="external-links__item" href={item.href} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StarterProgramAndOffers() {
  return (
    <div className="stack">
      <div>
        <h3 className={styles.subheading}>Предложения конкретного каталога</h3>
        <CurrentCatalogOffers embedded />
      </div>
      <div>
        <h3 className={styles.subheading}>Как проверять предложение</h3>
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

function OrderChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => new Set());

  function updateChecklistItem(id: string, checked: boolean) {
    setCheckedItems((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <>
      <p className={styles.helperText} aria-live="polite">
        Отметки останутся только на этой странице. Проверено {checkedItems.size} из {orderFinalChecklist.length}.
      </p>
      <ol className={styles.checklist}>
        {orderFinalChecklist.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={checkedItems.has(item.id)}
                onChange={(event) => updateChecklistItem(item.id, event.target.checked)}
              />{' '}
              {item.text}
            </label>
          </li>
        ))}
      </ol>
      <aside className="callout callout--warn" role="note">
        <p className="bodyText">{orderFinalNotice}</p>
        <ul className="external-links">
          {orderOfficialLinks.map((item) => (
            <li key={item.id}>
              <a className="external-links__item" href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
      <Scenario id="before-submit" />
    </>
  );
}

function renderStageContent(stage: FirstOrderStage) {
  switch (stage.contentType) {
    case 'video':
      return (
        <>
          {stage.video ? <LessonVideoPlayer video={stage.video} /> : null}
          {stage.summary?.length ? (
            <div className="lesson-video-summary">
              {stage.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
        </>
      );
    case 'text':
      return <ProductIntroduction />;
    case 'starter-program':
      return <StarterProgramAndOffers />;
    case 'step-sequence':
      return (
        <div className="stack">
          {stage.sequenceIds?.map((id) => {
            const sequence = sequenceById.get(id);
            return sequence ? <LearningStepSequence key={id} sequence={sequence} /> : null;
          })}
          {stage.id === 'delivery-and-receiving' ? (
            <div className="callout">
              <h3>Где проверить условия</h3>
              <p>Стоимость, доступность и условия зависят от заказа и адреса. Сверяйтесь с тем, что показано при оформлении.</p>
              {stage.links?.map((link) => (
                <a key={link.href} className="external-links__item" href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
              <Scenario id="delivery-cost" />
            </div>
          ) : null}
        </div>
      );
    case 'checklist':
      return <OrderChecklist />;
    case 'offers':
      return <CurrentCatalogOffers embedded />;
  }
}

export function OrdersPage() {
  return (
    <div className={`${styles.lesson} ${styles.stageOverview} tools-page`}>
      <Link to="/learn" className="tools-back">← К обучению</Link>
      <header className={styles.moduleHeader}>
        <h1>{firstOrderModuleMeta.title}</h1>
        <p>Пройди шесть этапов - от знакомства с продукцией до проверки заказа.</p>
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

  if (currentIndex < 0) return <Navigate to={firstOrderModuleMeta.path} replace />;

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
