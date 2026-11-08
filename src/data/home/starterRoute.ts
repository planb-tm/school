export type StarterRouteStepStatus = 'available' | 'upcoming';

export type StarterRouteStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  status: StarterRouteStepStatus;
  /** Present only for available steps with a real route. */
  path?: string;
};

export const starterRouteMeta = {
  title: 'Твой маршрут',
  subtitle:
    'Разберись в модели бизнеса и последовательно пройди основные этапы знакомства с системой',
  ctaLabel: 'Открыть маршрут',
  ctaPath: '/learn/business-essence',
} as const;

export const starterRouteSteps: readonly StarterRouteStep[] = [
  {
    id: 'business-essence',
    number: '01',
    title: 'Суть бизнеса',
    description: 'Разобраться в модели, принципах работы и основных понятиях',
    status: 'available',
    path: '/learn/business-essence',
  },
  {
    id: 'first-order',
    number: '02',
    title: 'Первый заказ',
    description: 'Изучить каталог, выбор продукции, оформление и доставку заказа',
    status: 'available',
    path: '/learn/orders',
  },
  {
    id: 'inviting',
    number: '03',
    title: 'Приглашения и общение',
    description:
      'Научиться рассказывать о возможностях, работать с вопросами и возражениями',
    status: 'available',
    path: '/learn/inviting',
  },
  {
    id: 'independent-work',
    number: '04',
    title: 'Самостоятельная работа',
    description: 'Разобраться, как организовать личную деятельность и работу с клиентами',
    status: 'upcoming',
  },
  {
    id: 'team-growth',
    number: '05',
    title: 'Развитие команды',
    description:
      'Познакомиться с основами передачи знаний и сопровождения новых партнёров',
    status: 'upcoming',
  },
] as const;
