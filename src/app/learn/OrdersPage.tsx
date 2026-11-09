import { Link, Navigate, useParams } from 'react-router-dom';
import { FirstOrderStageIcon } from '@/components/FirstOrderStageIcon';
import { LearningModuleStage } from '@/components/LearningModuleStage';
import { LearningStepSequence } from '@/components/LearningStepSequence';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import {
  firstOrderModuleMeta,
  getVisibleFirstOrderStages,
  type FirstOrderStage,
} from '@/data/learning/firstOrder';
import { orderStepSequences } from '@/data/learning/orders';
import styles from './OrdersPage.module.css';

const stages = getVisibleFirstOrderStages();

function renderStageContent(stage: FirstOrderStage) {
  switch (stage.contentType) {
    case 'intro':
      return (
        <div className={`lesson-intro ${styles.introContent}`}>
          <p className={styles.introLead}>
            <strong>Ты теперь Бьюти-партнёр Oriflame. Что дальше?</strong>
          </p>
          <p>
            После регистрации в Oriflame тебе становятся доступны продукция компании,
            специальные предложения и преимущества партнёрской программы.
          </p>
          <p>Давай разберёмся, какие возможности у тебя есть и с чего лучше начать.</p>

          <h3>15% постоянная скидка</h3>
          <p>
            Ты покупаешь продукцию Oriflame со скидкой 15% от цены каталога. Скидка
            применяется при оформлении заказа согласно условиям программы.
          </p>
          <h3>15% приветственный кешбэк</h3>
          <p>
            За первый заказ ты можешь получить дополнительный кешбэк 15%. Он
            зачисляется на электронный кошелёк после оплаты заказа. Накопленный
            кешбэк можно использовать для оплаты до 60% стоимости следующих заказов
            в течение 17 каталогов.
          </p>
          <h3>10% рекомендационный бонус</h3>
          <p>
            Если по твоей рекомендации зарегистрируются новые Бьюти- или
            Бизнес-партнёры, ты можешь получать бонус за их оплаченные заказы на
            первом уровне. Бонус рассчитывается по правилам компании и зачисляется
            на электронный кошелёк. Его также можно использовать для частичной оплаты
            последующих заказов.
          </p>
          <h3>Дополнительные акции и подарки</h3>
          <p>
            Для новых партнёров компания проводит специальные акции, предлагает
            подарки и выгодные условия оформления заказов. Актуальные предложения,
            условия получения подарков и доставки смотри в разделе{' '}
            <Link className={styles.orderingSiteLink} to="/learn/catalog-offers">
              Акции текущего каталога
            </Link>.
          </p>

          <h2>С чего начать?</h2>
          <p>Я всегда рекомендую начать партнерство именно с оформления заказа.</p>
          <p>
            Чтобы посмотреть, как оформляется заказ, как работает сайт, как работает
            доставка.
          </p>
          <p>Посмотрите, что у вас заканчивается или закончилось в косметичке, в ванной комнате.</p>
          <p>А также всегда можно подключить ваших друзей и родственников.</p>
          <p>
            Плюс оформление первого заказа - это максимально выгодно для нового партнера.
          </p>
        </div>
      );
    case 'plain-text':
      return (
        <div className={`lesson-intro ${styles.introContent}`}>
          <p>
            Заказы продукции Oriflame оформляются на официальном сайте{' '}
            <a
              className={styles.orderingSiteLink}
              href="https://oriflame.ru/"
              target="_blank"
              rel="noopener noreferrer"
            >
              oriflame.ru
            </a>.
          </p>
          {stage.introText?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <LearningStepSequence
            presentation="screenshots-only"
            sequence={orderStepSequences[0]}
          />
        </div>
      );
  }
}

export function OrdersPage() {
  return (
    <PageContainer variant="standard" className={styles.lesson}>
      <PageHeader title={firstOrderModuleMeta.title} backTo="/" />

      <section className={styles.stageOverview} aria-label="Подразделы оформления заказа">
        <ol className={styles.stageList} aria-label="Этапы модуля «Оформление заказа»">
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
      </section>
    </PageContainer>
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

  return (
    <PageContainer variant="standard" className={styles.lesson}>
      <PageHeader
        id={`${stage.id}-title`}
        title={stage.title}
        backTo={firstOrderModuleMeta.path}
        description={stage.description ?? ''}
      />

      <LearningModuleStage stage={stage} hideHeading>
        {renderStageContent(stage)}
      </LearningModuleStage>
    </PageContainer>
  );
}
