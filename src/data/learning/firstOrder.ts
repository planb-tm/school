import type { LessonVideo } from '@/types/learning';
import { deliveryHelpLink } from './orders';

export type FirstOrderStageStatus = 'ready' | 'draft' | 'hidden';
export type FirstOrderContentType =
  | 'video'
  | 'text'
  | 'step-sequence'
  | 'starter-program'
  | 'offers'
  | 'checklist';
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
  /** Text summary under the stage media (e.g. video transcript). */
  summary?: readonly string[];
  cardDescription: string;
  icon: FirstOrderStageIcon;
  contentType: FirstOrderContentType;
  status: FirstOrderStageStatus;
  order: number;
  placeholder?: string;
  video?: LessonVideo;
  image?: { path: string; alt: string; caption?: string };
  sequenceIds?: string[];
  links?: { label: string; href: string }[];
};

export const firstOrderModuleMeta = {
  id: 'first-order',
  title: 'Первый заказ',
  path: '/learn/orders',
  catalogDescription:
    'Разберись в продукции, выбери нужные товары, изучи предложения для новичков и научись оформлять заказ',
} as const;

/** Cover for the circular intro video on «Почему начать с первого заказа». */
export const FIRST_ORDER_INTRO_VIDEO_POSTER = `${import.meta.env.BASE_URL}media/orders/planb-video-preview.jpg`;

export const firstOrderStages: FirstOrderStage[] = [
  {
    id: 'why-first-order',
    path: '/learn/orders/why-first-order',
    title: 'Почему начать с первого заказа',
    cardDescription: 'Короткое введение',
    icon: 'box',
    contentType: 'video',
    status: 'ready',
    order: 1,
    video: {
      type: 'embed',
      url: 'https://kinescope.io/5dNj1xN4vQ67g3prZPVe5Y',
      poster: FIRST_ORDER_INTRO_VIDEO_POSTER,
      title: 'Почему начать с первого заказа',
      aspectRatio: '1:1',
      shape: 'circle',
    },
    summary: [
      'Первый заказ — это возможность воспользоваться специальными предложениями для новых партнёров. Если не оформить заказ, эти преимущества останутся недоступными.',
      'Также ты сразу разберёшься, как работает сайт, как оформлять заказы и как устроена доставка.',
      'Посмотри, что заканчивается дома: косметика, средства для ухода, товары для ванной комнаты. Можно также объединить заказ с покупками друзей и родственников.',
      'Перед оформлением обязательно изучи все акции для новых партнёров, чтобы получить максимум от первого заказа.',
    ],
  },
  {
    id: 'product-introduction',
    path: '/learn/orders/products',
    title: 'Знакомство с продукцией',
    description: 'Основные категории продукции и где посмотреть сведения о товарах.',
    cardDescription: 'Категории и выбор товаров',
    icon: 'bag',
    contentType: 'text',
    status: 'ready',
    order: 2,
  },
  {
    id: 'starter-program-and-offers',
    path: '/learn/orders/offers',
    title: 'Программа для новичков и предложения каталога',
    description:
      'Условия программы для новичков и предложения, привязанные к конкретному каталогу, - это разные материалы.',
    cardDescription: 'Стартовая программа и акции',
    icon: 'gift',
    contentType: 'starter-program',
    status: 'draft',
    order: 3,
    placeholder:
      'Условия программы для новичков ещё не добавлены. Они могут действовать несколько каталогов; актуальные предложения каталога будут показаны отдельно, когда их условия будут проверены по официальному источнику.',
  },
  {
    id: 'placing-an-order',
    path: '/learn/orders/checkout',
    title: 'Как оформить заказ',
    description: 'Выбор товаров, проверка корзины, итоговой суммы и подтверждение.',
    cardDescription: 'Пошаговая инструкция',
    icon: 'clipboard',
    contentType: 'step-sequence',
    status: 'ready',
    order: 4,
    sequenceIds: ['products-and-cart', 'total-and-confirmation'],
  },
  {
    id: 'delivery-and-receiving',
    path: '/learn/orders/delivery',
    title: 'Доставка и получение',
    description: 'Как сравнить доступные варианты и проверить условия получения.',
    cardDescription: 'Как получить заказ',
    icon: 'delivery',
    contentType: 'step-sequence',
    status: 'ready',
    order: 5,
    sequenceIds: ['delivery-choice'],
    links: [deliveryHelpLink],
  },
  {
    id: 'before-confirmation',
    path: '/learn/orders/final-check',
    title: 'Проверка перед подтверждением',
    description: 'Последовательно проверьте состав заказа и данные до отправки.',
    cardDescription: 'Контрольный список',
    icon: 'checklist',
    contentType: 'checklist',
    status: 'ready',
    order: 6,
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
