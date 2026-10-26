import type { LessonVideo } from '@/types/learning';
import { businessEssenceMeta } from './businessEssence';
import { invitingLessonMeta } from './inviting';
import { firstOrderModuleMeta } from './firstOrder';

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
 * Content is added only after sources are verified - no invented rules.
 */
export const learningCatalog: LearningCatalogItem[] = [
  {
    id: businessEssenceMeta.id,
    title: businessEssenceMeta.title,
    description: businessEssenceMeta.catalogDescription,
    path: businessEssenceMeta.path,
    status: 'available',
  },
  {
    id: firstOrderModuleMeta.id,
    title: firstOrderModuleMeta.title,
    description: firstOrderModuleMeta.catalogDescription,
    path: firstOrderModuleMeta.path,
    status: 'available',
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
      'Термины и общая логика вознаграждения. Подробный разбор и калькулятор - в разделе «Инструменты».',
    status: 'soon',
  },
];
