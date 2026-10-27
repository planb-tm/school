export const START_ROUTE_PATH = '/start';

export type StartRouteStep = {
  id: string;
  title: string;
  learningItemId?: string;
  path?: string;
  optional?: boolean;
};

/** Navigation only: labels refer to existing learning and tool catalogues. */
export const startRouteSteps: readonly StartRouteStep[] = [
  {
    id: 'business-essence',
    title: 'Разобраться в сути бизнеса',
    learningItemId: 'business-essence',
  },
  {
    id: 'first-order',
    title: 'Познакомиться с продукцией и первым заказом',
    learningItemId: 'first-order',
  },
  {
    id: 'inviting',
    title: 'Научиться приглашать и отвечать на вопросы',
    learningItemId: 'inviting-objections',
  },
  {
    id: 'tools',
    title: 'Изучить следующие инструменты',
    path: '/tools',
    optional: true,
  },
] as const;
