import type { LessonVideo } from '@/types/learning';
import { invitingLessonMeta } from './inviting';
import { productsLessonMeta } from './products';

export type LearningCatalogStatus = 'available' | 'soon';

export type LearningCatalogItem = {
  id: string;
  title: string;
  description?: string;
  path?: string;
  status: LearningCatalogStatus;
  /** Optional short video; omitted until a real source is chosen. */
  video?: LessonVideo;
};

/**
 * Target learning structure for newcomers.
 * Content is added only after sources are verified — no invented rules.
 */
export const learningCatalog: LearningCatalogItem[] = [
  {
    id: 'business-essence',
    title: 'Суть бизнеса',
    description:
      'Как устроен бизнес Oriflame, зачем нужен товарооборот и как он формируется за счёт заказов клиентов и команды',
    status: 'soon',
  },
  {
    id: productsLessonMeta.id,
    title: productsLessonMeta.title,
    description: productsLessonMeta.catalogDescription,
    path: productsLessonMeta.path,
    status: 'available',
  },
  {
    id: 'orders',
    title: 'Работа с заказом',
    description:
      'Как выбрать продукты, оформить заказ, выбрать способ доставки и проверить условия.',
    status: 'soon',
  },
  {
    id: invitingLessonMeta.id,
    title: invitingLessonMeta.title,
    description: invitingLessonMeta.catalogDescription,
    path: invitingLessonMeta.path,
    status: 'available',
  },
  {
    id: 'clients-partners',
    title: 'Работа с клиентами и партнёрами',
    description: 'Базовые сценарии коммуникации.',
    status: 'soon',
  },
  {
    id: 'marketing-plan-basics',
    title: 'Основы маркетинг-плана',
    description:
      'Термины и общая логика вознаграждения. Подробный разбор и калькулятор — в разделе «Инструменты».',
    status: 'soon',
  },
];
