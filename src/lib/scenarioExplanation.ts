import { formatBb, formatNumber, formatPercent, formatRub } from './format';
import {
  BB_TO_SALES_VOLUME_RUB,
  RECOMMENDATION_BONUS_RATE,
  bbToSalesVolume,
  type SuccessPlanScenarioInput,
  type SuccessPlanScenarioResult,
} from './successPlanCalculations';

export interface ExplanationStep {
  id: string;
  title: string;
  detail: string;
  formula?: string;
  valueLabel?: string;
}

function step(
  partial: ExplanationStep & { formula?: string; valueLabel?: string },
): ExplanationStep {
  const next: ExplanationStep = {
    id: partial.id,
    title: partial.title,
    detail: partial.detail,
  };
  if (partial.formula !== undefined) next.formula = partial.formula;
  if (partial.valueLabel !== undefined) next.valueLabel = partial.valueLabel;
  return next;
}

/** Human-readable walkthrough for a calculated scenario (educational UI). */
export function buildScenarioExplanation(
  input: SuccessPlanScenarioInput,
  result: SuccessPlanScenarioResult,
): ExplanationStep[] {
  const partnerCount = input.branches.length;
  const firstLevelBb = input.branches[0]?.firstLevelPartnerBb ?? 0;
  const branchBb = input.branches[0]?.branchBb ?? 0;
  const allSame =
    input.branches.every((b) => b.firstLevelPartnerBb === firstLevelBb) &&
    input.branches.every((b) => b.branchBb === branchBb);

  const partnerOp = bbToSalesVolume(firstLevelBb);
  const branchOp = bbToSalesVolume(branchBb);
  const diff = result.levelDifferences[0] ?? 0;

  return [
    step({
      id: 'personal',
      title: 'Личные Баллы Бонуса',
      detail: `Ваш личный объём: ${formatBb(input.personalBb)}.`,
      formula: `личные ББ = ${formatNumber(input.personalBb)}`,
      valueLabel: formatBb(input.personalBb),
    }),
    step({
      id: 'group',
      title: 'Баллы группы',
      detail: allSame
        ? `${partnerCount} ветв. × ${formatBb(branchBb)} = ${formatBb(result.groupBb)}.`
        : `Сумма ББ всех ветвей 1-го уровня = ${formatBb(result.groupBb)}.`,
      ...(allSame
        ? {
            formula: `${formatNumber(partnerCount)} × ${formatNumber(branchBb)} = ${formatNumber(result.groupBb)}`,
          }
        : {}),
      valueLabel: formatBb(result.groupBb),
    }),
    step({
      id: 'total-level',
      title: 'Общий объём и ваш уровень',
      detail: `${formatBb(input.personalBb)} + ${formatBb(result.groupBb)} = ${formatBb(result.totalBb)} → уровень Командного бонуса ${formatPercent(result.ownLevelPercent)} по таблице.`,
      formula: `${formatNumber(input.personalBb)} + ${formatNumber(result.groupBb)} = ${formatNumber(result.totalBb)} → ${result.ownLevelPercent}%`,
      valueLabel: `${formatBb(result.totalBb)} · ${formatPercent(result.ownLevelPercent)}`,
    }),
    step({
      id: 'branch-level',
      title: 'Уровень ветвей 1-го уровня',
      detail: allSame
        ? `Каждая ветвь ${formatBb(branchBb)} → ${formatPercent(result.branchLevels[0] ?? 0)}. Разница с вашим уровнем: ${formatPercent(result.ownLevelPercent)} − ${formatPercent(result.branchLevels[0] ?? 0)} = ${formatPercent(diff)}.`
        : `Уровни ветвей: ${result.branchLevels.map((p) => formatPercent(p)).join(', ')}.`,
      ...(allSame
        ? {
            formula: `${result.ownLevelPercent}% − ${result.branchLevels[0] ?? 0}% = ${diff}%`,
          }
        : {}),
      valueLabel: formatPercent(diff),
    }),
    step({
      id: 'recommendation',
      title: 'Рекомендационный бонус',
      detail: allSame
        ? `10% от ОП заказа партнёра 1-го уровня. В учебных примерах 1 ББ = ${formatNumber(BB_TO_SALES_VOLUME_RUB)} ₽ ОП.`
        : `10% от ОП заказов партнёров 1-го уровня (константа примеров ${formatNumber(BB_TO_SALES_VOLUME_RUB)} ₽/ББ).`,
      ...(allSame
        ? {
            formula: `${RECOMMENDATION_BONUS_RATE * 100}% × ${formatNumber(partnerOp)} ₽ × ${formatNumber(partnerCount)} = ${formatNumber(result.recommendationBonus)} ₽`,
          }
        : {}),
      valueLabel: formatRub(result.recommendationBonus),
    }),
    step({
      id: 'team',
      title: 'Командный бонус с групповых заказов',
      detail: allSame
        ? `Разница уровней × ОП каждой ветви × число ветвей.`
        : `Сумма по ветвям: (ваш % − % ветви) × ОП ветви.`,
      ...(allSame
        ? {
            formula: `${diff}% × ${formatNumber(branchOp)} ₽ × ${formatNumber(partnerCount)} = ${formatNumber(result.teamBonusFromGroupOrders)} ₽`,
          }
        : {}),
      valueLabel: formatRub(result.teamBonusFromGroupOrders),
    }),
    step({
      id: 'choice',
      title: 'Какая сумма больше',
      detail:
        result.selectedBonus === 'recommendation'
          ? `Рекомендационный ${formatRub(result.recommendationBonus)} ≥ Командного ${formatRub(result.teamBonusFromGroupOrders)} → в учебной модели выбирается рекомендационный.`
          : `Командный ${formatRub(result.teamBonusFromGroupOrders)} > Рекомендационного ${formatRub(result.recommendationBonus)} → в учебной модели выбирается командный.`,
      formula: `max(${formatNumber(result.recommendationBonus)}, ${formatNumber(result.teamBonusFromGroupOrders)}) = ${formatNumber(result.selectedAmount)}`,
      valueLabel: formatRub(result.selectedAmount),
    }),
  ];
}

export const MODEL_LIMITATIONS = [
  'Модель учебная: воспроизводит логику контрольных примеров, а не полный расчёт кабинета Oriflame.',
  'Используется константа примеров документа: 1 ББ = 62 ₽ ОП. Реальный ОП берётся из прайса.',
  'Не проверяется квалификация 150 личных ББ (правило 75 / 75).',
  'Не учитываются продукты без ББ, пониженный ОП, выход 23%-х групп и Директорские бонусы.',
  'Результат не является официальным расчётом и не гарантирует доход.',
] as const;
