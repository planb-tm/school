import { successPlanModuleMeta } from '@/data/success-plan-2026/module';

export const MODULE_BASE = successPlanModuleMeta.path;

export const MODULE_SECTIONS = [
  { id: 'overview', label: 'Введение', hint: 'Роль «Плана Успеха»' },
  { id: 'concepts', label: 'Понятия', hint: 'ББ, ОП, группа' },
  { id: 'bonus-steps', label: 'Принципы', hint: 'Логика бонусов' },
  { id: 'examples', label: 'Примеры', hint: 'Контрольные разборы' },
  { id: 'try', label: 'Практика', hint: 'Свои числа' },
  { id: 'quiz', label: 'Тест', hint: 'Проверка себя' },
  { id: 'sources', label: 'Источники', hint: 'Статусы сверки' },
] as const;

export type ModuleSectionId = (typeof MODULE_SECTIONS)[number]['id'];

export function isModuleSectionId(value: string): value is ModuleSectionId {
  return MODULE_SECTIONS.some((section) => section.id === value);
}

export function sectionPath(id: ModuleSectionId): string {
  return `${MODULE_BASE}/${id}`;
}

export function nextSectionId(id: ModuleSectionId): ModuleSectionId | null {
  const index = MODULE_SECTIONS.findIndex((section) => section.id === id);
  if (index < 0 || index >= MODULE_SECTIONS.length - 1) return null;
  return MODULE_SECTIONS[index + 1].id;
}

export function prevSectionId(id: ModuleSectionId): ModuleSectionId | null {
  const index = MODULE_SECTIONS.findIndex((section) => section.id === id);
  if (index <= 0) return null;
  return MODULE_SECTIONS[index - 1].id;
}
