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
        'Разберись в продукции, выбери нужные товары, изучи предложения для новичков и научись оформлять заказ',
      path: '/learn/orders',
    });
  });

  it('renders visible stages by their explicit order and omits hidden stages', () => {
    const customStages: FirstOrderStage[] = [
      { ...firstOrderStages[0], id: 'later', order: 8 },
      { ...firstOrderStages[1], id: 'hidden', order: 1, status: 'hidden' },
      { ...firstOrderStages[2], id: 'earlier', order: 2 },
    ];

    expect(getVisibleFirstOrderStages(customStages).map((stage) => stage.id)).toEqual([
      'earlier',
      'later',
    ]);
  });

  it('has six ordered stages and marks only completed materials as ready', () => {
    expect(getVisibleFirstOrderStages().map((stage) => stage.order)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(getVisibleFirstOrderStages().map((stage) => stage.path)).toEqual([
      '/learn/orders/why-first-order',
      '/learn/orders/products',
      '/learn/orders/offers',
      '/learn/orders/checkout',
      '/learn/orders/delivery',
      '/learn/orders/final-check',
    ]);
    expect(firstOrderStages[0].video).toMatchObject({
      type: 'embed',
      title: 'Почему начать с первого заказа',
      aspectRatio: '1:1',
      shape: 'circle',
    });
    expect(firstOrderStages[0].video?.url).toBe('https://kinescope.io/5dNj1xN4vQ67g3prZPVe5Y');
    expect(firstOrderStages[0].description).toBeUndefined();
    expect(firstOrderStages[2].placeholder).toContain('несколько каталогов');
    expect(firstOrderStages[0].status).toBe('ready');
    expect(firstOrderStages[2].status).toBe('draft');
    expect(firstOrderStages[4].links?.[0]).toMatchObject({
      label: 'Официальный сайт Oriflame - раздел «Помощь»',
      href: 'https://oriflame.ru/',
    });
  });
});
