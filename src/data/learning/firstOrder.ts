import { deliveryHelpLink } from './orders';

export type FirstOrderStageStatus = 'ready' | 'draft' | 'hidden';
export type FirstOrderContentType = 'intro' | 'step-sequence';
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
  sequenceIds?: string[];
  links?: { label: string; href: string }[];
  includeProductIntroduction?: boolean;
  includeFinalChecklist?: boolean;
};

export const firstOrderModuleMeta = {
  id: 'first-order',
  title: 'Первый заказ',
  path: '/learn/orders',
  catalogDescription:
    'Узнай, зачем начинать с первого заказа, и пройди оформление - от выбора товаров до получения и проверки',
} as const;

export const firstOrderStages: FirstOrderStage[] = [
  {
    id: 'why-first-order',
    path: '/learn/orders/why-first-order',
    title: 'Почему важно начать с первого заказа',
    description: 'Что даёт первый практический опыт и где смотреть условия стартовой программы.',
    cardDescription: 'Зачем оформлять заказ и какие преимущества доступны новичку',
    icon: 'box',
    contentType: 'intro',
    status: 'ready',
    order: 1,
    introText: [
      'Первый заказ переводит знакомство с кабинетом и продукцией в практику. Перед оформлением проверь, какие условия стартовой программы доступны именно тебе.',
    ],
  },
  {
    id: 'placing-an-order',
    path: '/learn/orders/checkout',
    title: 'Как оформить заказ',
    description: 'Пошаговый путь от выбора товаров до получения и проверки заказа.',
    cardDescription: 'Оформление, доставка, получение и проверка',
    icon: 'clipboard',
    contentType: 'step-sequence',
    status: 'ready',
    order: 2,
    sequenceIds: ['products-and-cart', 'delivery-choice', 'total-and-confirmation'],
    links: [deliveryHelpLink],
    includeProductIntroduction: true,
    includeFinalChecklist: true,
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
