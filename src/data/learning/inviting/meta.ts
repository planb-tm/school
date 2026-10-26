import type { InvitingSectionId } from './types';

export const invitingLessonMeta = {
  id: 'inviting-objections',
  title: 'Приглашения и возражения',
  path: '/learn/inviting',
  catalogDescription:
    'Шаблоны приглашений, ответы на возражения, готовые сообщения и правила общения.',
} as const;

export const invitingIntro =
  'Здесь собраны готовые сообщения для приглашения знакомых, ответы на частые вопросы и возражения, а также рекомендации по общению. Используй материалы как основу, адаптируй тексты под себя и учись спокойно рассказывать о возможности без давления и навязывания.';

export const invitingSections: {
  id: InvitingSectionId;
  title: string;
  hint: string;
}[] = [
  {
    id: 'invitations',
    title: 'Первые приглашения',
    hint: 'Как предложить знакомому посмотреть информацию о бизнесе.',
  },
  {
    id: 'objections',
    title: 'Ответы на возражения',
    hint: 'Как спокойно реагировать на сомнения и вопросы.',
  },
  {
    id: 'followups',
    title: 'Готовые сообщения',
    hint: 'Что написать после видео, интереса или отказа.',
  },
  {
    id: 'rules',
    title: 'Правила общения',
    hint: 'Основные принципы работы с контактами.',
  },
];
