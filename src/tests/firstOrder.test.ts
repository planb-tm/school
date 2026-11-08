import { describe, expect, it } from 'vitest';
import { learningCatalog } from '@/data/learning/catalog';
import {
  firstOrderModuleMeta,
  firstOrderStages,
  getVisibleFirstOrderStages,
  type FirstOrderStage,
} from '@/data/learning/firstOrder';

describe('Первый заказ', () => {
  it('replaces the separate product and order cards with one module card', () => {
    const moduleCards = learningCatalog.filter((item) =>
      item.path === '/learn/orders' || item.path === '/learn/products',
    );

    expect(moduleCards).toHaveLength(1);
    expect(moduleCards[0]).toMatchObject({
      id: firstOrderModuleMeta.id,
      title: 'Первый заказ',
      description:
        'Узнай, зачем начинать с первого заказа, и пройди оформление - от выбора товаров до получения и проверки',
      path: '/learn/orders',
    });
  });

  it('renders visible stages by their explicit order and omits hidden stages', () => {
    const customStages: FirstOrderStage[] = [
      { ...firstOrderStages[0], id: 'later', order: 8 },
      { ...firstOrderStages[1], id: 'hidden', order: 1, status: 'hidden' },
      { ...firstOrderStages[0], id: 'earlier', order: 2 },
    ];

    expect(getVisibleFirstOrderStages(customStages).map((stage) => stage.id)).toEqual([
      'earlier',
      'later',
    ]);
  });

  it('has exactly two stages and combines the full order flow in the second stage', () => {
    expect(getVisibleFirstOrderStages().map((stage) => stage.order)).toEqual([1, 2]);
    expect(getVisibleFirstOrderStages().map((stage) => stage.path)).toEqual([
      '/learn/orders/why-first-order',
      '/learn/orders/checkout',
    ]);
    expect(firstOrderStages[0]).toMatchObject({
      title: 'Почему важно начать с первого заказа',
      contentType: 'intro',
      status: 'ready',
    });
    expect(firstOrderStages[0].introText).toHaveLength(1);
    expect(firstOrderStages[0]).not.toHaveProperty('video');
    expect(firstOrderStages[1]).toMatchObject({
      title: 'Как оформить заказ',
      contentType: 'step-sequence',
      sequenceIds: ['products-and-cart', 'delivery-choice', 'total-and-confirmation'],
      includeFinalChecklist: true,
    });
    expect(firstOrderStages[1].links?.[0]).toMatchObject({
      label: 'Официальный сайт Oriflame - раздел «Помощь»',
      href: 'https://oriflame.ru/',
    });
  });
});
