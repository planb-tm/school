import {
  plannedModules,
  successPlanModuleMeta,
} from '@/data/success-plan-2026/module';

export type LearningCatalogStatus = 'available' | 'soon';

export type LearningCatalogItem = {
  id: string;
  title: string;
  description?: string;
  path: string;
  status: LearningCatalogStatus;
};

export const learningCatalog: LearningCatalogItem[] = [
  {
    id: successPlanModuleMeta.id,
    title: successPlanModuleMeta.title,
    description:
      'Как устроен маркетинг-план Oriflame: основные понятия, принципы расчёта бонусов и разбор примеров.',
    path: successPlanModuleMeta.path,
    status: 'available',
  },
  ...plannedModules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    description: mod.subtitle,
    path: mod.path,
    status: 'soon' as const,
  })),
];
