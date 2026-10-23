import { successPlanModuleMeta } from '@/data/success-plan-2026/module';

export type ToolStatus = 'available' | 'soon';

export type ToolMeta = {
  id: string;
  title: string;
  description?: string;
  path: string;
  status: ToolStatus;
};

export const toolsCatalog: ToolMeta[] = [
  {
    id: successPlanModuleMeta.id,
    title: successPlanModuleMeta.title,
    description:
      'Разбор маркетинг-плана: понятия, условия, принципы расчёта бонусов, примеры и проверка знаний.',
    path: successPlanModuleMeta.path,
    status: 'available',
  },
  {
    id: 'info-sheet',
    title: 'Визуализатор информационного листка',
    description:
      'Просмотр и анализ структуры команды на основе загруженного информационного листка Excel.',
    path: '/tools/info-sheet',
    status: 'available',
  },
];

export function getToolById(id: string): ToolMeta | undefined {
  return toolsCatalog.find((tool) => tool.id === id);
}
