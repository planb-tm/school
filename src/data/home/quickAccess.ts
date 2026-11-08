export type QuickAccessIcon = 'calculator' | 'sheet' | 'messages' | 'learn';

export type QuickAccessItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: QuickAccessIcon;
};

export const quickAccessMeta = {
  title: 'Быстрый доступ',
} as const;

export const quickAccessItems: readonly QuickAccessItem[] = [
  {
    id: 'success-plan',
    title: 'План Успеха 2026',
    description: 'Обучающий модуль, принципы и расчёты',
    path: '/modules/success-plan-2026',
    icon: 'calculator',
  },
  {
    id: 'info-sheet',
    title: 'Анализ информационного листка',
    description: 'Работа со структурой и данными Excel',
    path: '/tools/info-sheet',
    icon: 'sheet',
  },
  {
    id: 'inviting',
    title: 'Приглашения и возражения',
    description: 'Шаблоны сообщений и работа с вопросами',
    path: '/learn/inviting',
    icon: 'messages',
  },
  {
    id: 'learn',
    title: 'Обучение',
    description: 'Все доступные обучающие материалы',
    path: '/learn',
    icon: 'learn',
  },
] as const;
