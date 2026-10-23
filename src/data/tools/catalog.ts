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
    id: 'info-sheet',
    title: 'Визуализатор информационного листка',
    path: '/tools/info-sheet',
    status: 'available',
  },
];

export function getToolById(id: string): ToolMeta | undefined {
  return toolsCatalog.find((tool) => tool.id === id);
}
