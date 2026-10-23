import type { LearningQuestion } from '@/types/learning';
import { SUCCESS_PLAN_SOURCE_ID } from './sources';

const sp = (pages: number[]): LearningQuestion['sources'] => [
  { sourceId: SUCCESS_PLAN_SOURCE_ID, pages },
];

export const learningQuestions: LearningQuestion[] = [
  {
    id: 'q1-level-650',
    prompt: 'Сколько процентов Командного бонуса соответствует 650 Баллам Бонуса?',
    options: ['3%', '6%', '9%', '15%'],
    correctIndex: 1,
    explanation:
      'По таблице на с. 21: диапазон 450–899 ББ соответствует 6%. В примере 1 как раз 650 ББ = 6%.',
    sources: sp([20, 21]),
    status: 'verified',
  },
  {
    id: 'q2-max-of-two',
    prompt:
      'Если Рекомендационный бонус 3 100 ₽, а Командный с групповых заказов 1 860 ₽, что вы получаете?',
    options: [
      'Сумму обоих: 4 960 ₽',
      'Только Командный бонус 1 860 ₽',
      'Только Рекомендационный бонус 3 100 ₽',
      'Среднее арифметическое',
    ],
    correctIndex: 2,
    explanation:
      'Вы всегда получаете наибольшую из двух сумм. В примере 1 командный меньше, поэтому платится рекомендационный 3 100 ₽.',
    sources: sp([19, 20]),
    status: 'verified',
  },
  {
    id: 'q3-example2-diff',
    prompt:
      'В примере 2 ваш уровень 15%, уровень каждой ветви 6%. Какая разница используется для Командного бонуса?',
    options: ['6%', '9%', '15%', '21%'],
    correctIndex: 1,
    explanation: '15% − 6% = 9%. Именно эта разница умножается на ОП каждой ветви.',
    sources: sp([22]),
    status: 'verified',
  },
  {
    id: 'q4-qualification',
    prompt:
      'Какой минимум личных Баллов Бонуса нужен, чтобы претендовать на Рекомендационный / Командный бонус?',
    options: ['50 ББ', '100 ББ', '150 ББ', '450 ББ'],
    correctIndex: 2,
    explanation:
      'В документе указано не менее 150 личных ББ в каталоге, из которых минимум 75 - за ваши личные заказы.',
    sources: sp([17, 18]),
    status: 'verified',
  },
  {
    id: 'q5-bb-to-op',
    prompt: 'В контрольных примерах «Плана Успеха» чему равен 1 Балл Бонуса в объёме продаж?',
    options: ['50 ₽', '62 ₽', '75 ₽', '100 ₽'],
    correctIndex: 1,
    explanation:
      'В примерах документа явно указано: 1 Балл Бонуса = 62 ₽ ОП. Это учебная константа примеров, не универсальная цена каждого продукта.',
    sources: sp([17, 20]),
    status: 'verified',
  },
];
