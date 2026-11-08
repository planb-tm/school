export type FirstOrderStageStatus = 'ready' | 'draft' | 'hidden';
export type FirstOrderContentType = 'intro' | 'plain-text';
export type FirstOrderStageIcon =
  | 'box'
  | 'bag'
  | 'gift'
  | 'clipboard'
  | 'delivery'
  | 'checklist';

export type FirstOrderStage = {
  id: string;
  path: string;
  title: string;
  description?: string;
  /** Short introductory text shown before the stage content. */
  introText?: readonly string[];
  cardDescription: string;
  icon: FirstOrderStageIcon;
  contentType: FirstOrderContentType;
  status: FirstOrderStageStatus;
  order: number;
  placeholder?: string;
};

export const firstOrderModuleMeta = {
  id: 'first-order',
  title: 'Оформление заказа',
  path: '/learn/orders',
  catalogDescription:
    'Узнай, зачем начинать с первого заказа и как оформить заказ на официальном сайте Oriflame',
} as const;

export const firstOrderStages: FirstOrderStage[] = [
  {
    id: 'why-first-order',
    path: '/learn/orders/why-first-order',
    title: 'Почему важно начать с первого заказа',
    cardDescription: 'Зачем оформлять заказ и какие преимущества доступны новичку',
    icon: 'box',
    contentType: 'intro',
    status: 'ready',
    order: 1,
  },
  {
    id: 'placing-an-order',
    path: '/learn/orders/checkout',
    title: 'Как оформить заказ',
    cardDescription: 'Пошаговое оформление заказа',
    icon: 'clipboard',
    contentType: 'plain-text',
    status: 'ready',
    order: 2,
    introText: [
      'Для входа в личный кабинет используйте свои данные для авторизации. Информация для входа была отправлена вам в сообщении после регистрации.',
      'После авторизации вы сможете выбирать продукцию из каталога, добавлять товары в корзину и оформлять заказы.',
    ],
  },
];

export function getVisibleFirstOrderStages(
  stages: readonly FirstOrderStage[] = firstOrderStages,
): FirstOrderStage[] {
  return stages
    .filter((stage) => stage.status !== 'hidden')
    .slice()
    .sort((left, right) => left.order - right.order);
}

export function firstOrderStageAnchor(id: string): string {
  return `first-order-${id}`;
}
