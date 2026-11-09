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
    title: 'Оформление заказа',
    description: 'Понять, зачем начинать с заказа, и узнать, как его оформить',
    status: 'available',
    path: '/learn/orders',
  },
  {
    id: 'catalog-offers',
    number: '03',
    title: 'Акции текущего каталога',
    description: 'Скидки, бонусы, подарки и условия текущего каталога',
    status: 'available',
    path: '/learn/catalog-offers',
  },
  {
    id: 'inviting',
    number: '04',
    title: 'Приглашения и общение',
    description:
      'Научиться рассказывать о возможностях, работать с вопросами и возражениями',
    status: 'available',
    path: '/learn/inviting',
  },
  {
    id: 'independent-work',
    number: '05',
    title: 'Самостоятельная работа',
    description: 'Разобраться, как организовать личную деятельность и работу с клиентами',
    status: 'upcoming',
  },
  {
    id: 'team-growth',
    number: '06',
    title: 'Развитие команды',
    description:
      'Познакомиться с основами передачи знаний и сопровождения новых партнёров',
    status: 'upcoming',
  },
] as const;
