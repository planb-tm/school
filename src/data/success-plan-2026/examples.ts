import type { CalculationExample } from '@/types/learning';
import { SUCCESS_PLAN_SOURCE_ID } from './sources';

const DISCLAIMER =
  'Цифры - контрольные результаты примеров из документа, а не обещание или гарантия дохода. Фактический доход зависит от навыков, усилий, времени и других факторов.';

export const calculationExamples: CalculationExample[] = [
  {
    id: 'example-1',
    title: 'Пример 1 - старт с пятью партнёрами',
    description:
      'Вы заказали на 150 ББ. Пять партнёров 1-го уровня сделали заказы по 100 ББ. Групповой объём 650 ББ → уровень 6%. Командный бонус меньше рекомендационного, поэтому выбирается рекомендационный.',
    inputs: {
      personalBb: 150,
      firstLevelPartners: 5,
      partnerBbEach: 100,
      groupBb: 650,
      bbToOp: 62,
    },
    steps: [
      {
        label: 'Личный объём',
        detail: 'Вы заказали на 150 Баллов Бонуса.',
        value: '150 ББ',
      },
      {
        label: 'Группа 1-го уровня',
        detail: '5 партнёров × 100 ББ = 500 ББ.',
        value: '500 ББ',
      },
      {
        label: 'Общие ББ группы',
        detail: '150 + 500 = 650 ББ → уровень Командного бонуса 6%.',
        value: '650 ББ = 6%',
      },
      {
        label: 'Уровень партнёров',
        detail: '100 ББ у каждого → 0%. Разница уровней: 6% − 0% = 6%.',
        value: '6%',
      },
      {
        label: 'Рекомендационный бонус',
        detail: '10% × 6 200 ₽ × 5 = 3 100 ₽.',
        value: 3100,
      },
      {
        label: 'Командный бонус с групповых заказов',
        detail: '6% × 6 200 ₽ × 5 = 1 860 ₽.',
        value: 1860,
      },
      {
        label: 'Выбор',
        detail:
          '1 860 ₽ < 3 100 ₽ → получаете Рекомендационный бонус 3 100 ₽ (командный не добавляется).',
        value: 3100,
      },
    ],
    expected: {
      recommendationBonus: 3100,
      teamBonus: 1860,
      selectedBonus: 'recommendation',
      selectedAmount: 3100,
      ownLevelPercent: 6,
      totalBb: 650,
    },
    sources: [{ sourceId: SUCCESS_PLAN_SOURCE_ID, pages: [20] }],
    status: 'verified',
    disclaimer: DISCLAIMER,
  },
  {
    id: 'example-2',
    title: 'Пример 2 - рост в глубину',
    description:
      'Личный объём по-прежнему 150 ББ. У каждого из пяти партнёров 1-го уровня ветвь по 600 ББ (уровень 6%). Общий объём 3 150 ББ → ваш уровень 15%. Командный бонус превышает рекомендационный.',
    inputs: {
      personalBb: 150,
      groupBb: 3000,
      totalBb: 3150,
      branchBbEach: 600,
      firstLevelPartnerBbEach: 100,
      ownLevelPercent: 15,
      branchLevelPercent: 6,
      levelDiffPercent: 9,
      bbToOp: 62,
    },
    steps: [
      {
        label: 'Личный объём',
        detail: 'Вы заказали на 150 Баллов Бонуса.',
        value: '150 ББ',
      },
      {
        label: 'Групповой объём',
        detail: '3 000 ББ группы + 150 личных = 3 150 ББ → уровень 15%.',
        value: '3 150 ББ = 15%',
      },
      {
        label: 'Ветви 1-го уровня',
        detail: 'Каждая из пяти веток - 600 ББ → уровень 6%.',
        value: '600 ББ = 6%',
      },
      {
        label: 'Разница уровней',
        detail: '15% − 6% = 9%.',
        value: '9%',
      },
      {
        label: 'Рекомендационный бонус',
        detail: '10% × 6 200 ₽ × 5 = 3 100 ₽ (с заказов партнёров 1-го уровня).',
        value: 3100,
      },
      {
        label: 'Командный бонус с групповых заказов',
        detail: '9% × 37 200 ₽ × 5 = 16 740 ₽.',
        value: 16740,
      },
      {
        label: 'Выбор',
        detail: '16 740 ₽ > 3 100 ₽ → получаете наибольшую сумму 16 740 ₽.',
        value: 16740,
      },
    ],
    expected: {
      recommendationBonus: 3100,
      teamBonus: 16740,
      selectedBonus: 'team',
      selectedAmount: 16740,
      ownLevelPercent: 15,
      totalBb: 3150,
    },
    sources: [{ sourceId: SUCCESS_PLAN_SOURCE_ID, pages: [22] }],
    status: 'verified',
    disclaimer: DISCLAIMER,
  },
];
