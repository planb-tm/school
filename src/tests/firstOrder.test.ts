import { describe, expect, it } from 'vitest';
import { learningCatalog } from '@/data/learning/catalog';
import {
  firstOrderModuleMeta,
  firstOrderStages,
  getVisibleFirstOrderStages,
  type FirstOrderStage,
} from '@/data/learning/firstOrder';
import { starterRouteSteps } from '@/data/home/starterRoute';

describe('Оформление заказа', () => {
  it('replaces the separate product and order cards with one module card', () => {
    const moduleCards = learningCatalog.filter((item) =>
      item.path === '/learn/orders' || item.path === '/learn/products',
    );

    expect(moduleCards).toHaveLength(1);
    expect(moduleCards[0]).toMatchObject({
      id: firstOrderModuleMeta.id,
      title: 'Оформление заказа',
      description:
        'Узнай, зачем начинать с первого заказа и как оформить заказ на официальном сайте Oriflame',
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
      title: 'Почему важно начать с заказа',
      contentType: 'intro',
      status: 'ready',
    });
    expect(firstOrderStages[0]).not.toHaveProperty('introText');
    expect(firstOrderStages[0]).not.toHaveProperty('description');
    expect(firstOrderStages[0]).not.toHaveProperty('video');
    expect(firstOrderStages[1]).toMatchObject({
      title: 'Как оформить заказ',
      contentType: 'plain-text',
      cardDescription: 'Пошаговое оформление заказа',
      introText: [
        'Для входа в личный кабинет используйте свои данные для авторизации. Информация для входа была отправлена вам в сообщении после регистрации.',
        'После авторизации вы сможете выбирать продукцию из каталога, добавлять товары в корзину и оформлять заказы.',
      ],
    });
    expect(firstOrderStages[1]).not.toHaveProperty('sequenceIds');
    expect(firstOrderStages[1]).not.toHaveProperty('description');
  });

  it('places current catalog offers on the home route as step 03', () => {
    expect(starterRouteSteps.slice(0, 4)).toMatchObject([
      { number: '01', title: 'Суть бизнеса', path: '/learn/business-essence' },
      { number: '02', title: 'Оформление заказа', path: '/learn/orders' },
      { number: '03', title: 'Акции текущего каталога', path: '/learn/catalog-offers' },
      { number: '04', title: 'Приглашения и общение', path: '/learn/inviting' },
    ]);
  });
});
