export type ToolStatus = 'available' | 'soon';

export type ToolMeta = {
  id: string;
  title: string;
  description: string;
  path: string;
  status: ToolStatus;
};

export const toolsCatalog: ToolMeta[] = [
  {
    id: 'info-sheet',
    title: 'Информационный листок',
    description:
      'Загрузите Excel-отчёт Oriflame и разберите структуру команды: обзор, поиск партнёров и дерево спонсорских связей. Данные остаются только в браузере.',
    path: '/tools/info-sheet',
    status: 'available',
  },
];

export function getToolById(id: string): ToolMeta | undefined {
  return toolsCatalog.find((tool) => tool.id === id);
}
