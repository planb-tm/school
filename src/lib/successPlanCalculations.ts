/**
 * Educational calculation helpers for «План Успеха 2026» examples.
 *
 * IMPORTANT LIMITATIONS (shown in UI):
 * - Matches documented control examples; not a full official income engine.
 * - Does not model all exceptions (products without BB, reduced OP, 23%
 *   group exits, Director bonuses, Beauty Partner programmes, etc.).
 * - Does not verify the 150 ББ qualification split (75 personal / 75 personal
 *   or Beauty Partners of level 1 excluding Business Partners).
 * - Figures are illustrations from the document, not income guarantees.
 */

import { getTeamBonusPercent } from './teamBonusLevels';

/** Documented conversion used in examples: 1 ББ = 62 ₽ объёма продаж (ОП). */
export const BB_TO_SALES_VOLUME_RUB = 62;

export const RECOMMENDATION_BONUS_RATE = 0.1;

export type SelectedBonusKind = 'recommendation' | 'team';

export interface BranchInput {
  /** Bonus points of the whole first-level branch (partner + their group). */
  branchBb: number;
  /**
   * Bonus points of orders placed by the first-level partner themselves
   * (base for recommendation bonus in the document examples).
   */
  firstLevelPartnerBb: number;
}

export interface SuccessPlanScenarioInput {
  personalBb: number;
  branches: BranchInput[];
}

export interface SuccessPlanScenarioResult {
  groupBb: number;
  totalBb: number;
  ownLevelPercent: number;
  branchLevels: number[];
  levelDifferences: number[];
  recommendationBonus: number;
  teamBonusFromGroupOrders: number;
  /** Amount paid after choosing the larger of the two. */
  selectedAmount: number;
  selectedBonus: SelectedBonusKind;
  /** Team bonus after subtracting recommendation (document step 5). */
  teamBonusNet: number;
  salesVolumePerBb: number;
}

function assertNonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative finite number`);
  }
}

export type ScenarioCalcOutcome =
  | { ok: true; result: SuccessPlanScenarioResult }
  | { ok: false; error: string };

/** Safe wrapper with Russian messages for the learning UI. */
export function tryCalculateSuccessPlanScenario(
  input: SuccessPlanScenarioInput,
): ScenarioCalcOutcome {
  try {
    if (!Number.isFinite(input.personalBb) || input.personalBb < 0) {
      return { ok: false, error: 'Личные ББ должны быть числом ≥ 0.' };
    }
    if (!Array.isArray(input.branches) || input.branches.length === 0) {
      return {
        ok: false,
        error: 'Нужна хотя бы одна ветвь 1-го уровня.',
      };
    }
    for (const [index, branch] of input.branches.entries()) {
      if (!Number.isFinite(branch.branchBb) || branch.branchBb < 0) {
        return {
          ok: false,
          error: `Ветвь ${index + 1}: ББ ветви должны быть числом ≥ 0.`,
        };
      }
      if (
        !Number.isFinite(branch.firstLevelPartnerBb) ||
        branch.firstLevelPartnerBb < 0
      ) {
        return {
          ok: false,
          error: `Ветвь ${index + 1}: ББ партнёра 1-го уровня должны быть числом ≥ 0.`,
        };
      }
      if (branch.firstLevelPartnerBb > branch.branchBb) {
        return {
          ok: false,
          error:
            'ББ заказа партнёра 1-го уровня не могут быть больше ББ всей ветви.',
        };
      }
    }
    return { ok: true, result: calculateSuccessPlanScenario(input) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Не удалось выполнить расчёт.',
    };
  }
}

export function bbToSalesVolume(bonusPoints: number): number {
  assertNonNegative('bonusPoints', bonusPoints);
  return bonusPoints * BB_TO_SALES_VOLUME_RUB;
}

/**
 * Recommendation bonus: 10% × sales volume of first-level partners' own orders.
 * Matches examples on pages 17, 20, 22 of «План Успеха 2026».
 */
export function calculateRecommendationBonus(
  firstLevelPartnerBbList: number[],
): number {
  return firstLevelPartnerBbList.reduce((sum, bb) => {
    assertNonNegative('firstLevelPartnerBb', bb);
    return sum + RECOMMENDATION_BONUS_RATE * bbToSalesVolume(bb);
  }, 0);
}

/**
 * Team bonus from group orders before comparing with recommendation bonus:
 * sum over branches of (ownLevel% − branchLevel%) × branch sales volume.
 */
export function calculateTeamBonusFromGroupOrders(
  ownLevelPercent: number,
  branches: BranchInput[],
): number {
  assertNonNegative('ownLevelPercent', ownLevelPercent);

  return branches.reduce((sum, branch) => {
    assertNonNegative('branchBb', branch.branchBb);
    const branchLevel = getTeamBonusPercent(branch.branchBb);
    const diffPercent = Math.max(0, ownLevelPercent - branchLevel);
    return sum + (diffPercent / 100) * bbToSalesVolume(branch.branchBb);
  }, 0);
}

/**
 * Document rule (p. 19–21): earn the greater of recommendation bonus vs
 * team bonus from group orders. If team ≤ recommendation, recommendation
 * is paid and team bonus is 0.
 */
export function selectPaidBonus(
  recommendationBonus: number,
  teamBonusFromGroupOrders: number,
): { selectedBonus: SelectedBonusKind; selectedAmount: number; teamBonusNet: number } {
  assertNonNegative('recommendationBonus', recommendationBonus);
  assertNonNegative('teamBonusFromGroupOrders', teamBonusFromGroupOrders);

  const teamBonusNet = teamBonusFromGroupOrders - recommendationBonus;

  if (teamBonusNet > 0) {
    return {
      selectedBonus: 'team',
      selectedAmount: teamBonusFromGroupOrders,
      teamBonusNet,
    };
  }

  return {
    selectedBonus: 'recommendation',
    selectedAmount: recommendationBonus,
    teamBonusNet,
  };
}

/** Full educational scenario used by examples and the «Попробуй сам» tool. */
export function calculateSuccessPlanScenario(
  input: SuccessPlanScenarioInput,
): SuccessPlanScenarioResult {
  assertNonNegative('personalBb', input.personalBb);
  if (input.branches.length === 0) {
    throw new RangeError('branches must contain at least one branch');
  }

  const groupBb = input.branches.reduce((sum, b) => {
    assertNonNegative('branchBb', b.branchBb);
    assertNonNegative('firstLevelPartnerBb', b.firstLevelPartnerBb);
    if (b.firstLevelPartnerBb > b.branchBb) {
      throw new RangeError(
        'firstLevelPartnerBb cannot exceed branchBb for the same branch',
      );
    }
    return sum + b.branchBb;
  }, 0);

  const totalBb = input.personalBb + groupBb;
  const ownLevelPercent = getTeamBonusPercent(totalBb);
  const branchLevels = input.branches.map((b) => getTeamBonusPercent(b.branchBb));
  const levelDifferences = branchLevels.map((lvl) =>
    Math.max(0, ownLevelPercent - lvl),
  );

  const recommendationBonus = calculateRecommendationBonus(
    input.branches.map((b) => b.firstLevelPartnerBb),
  );
  const teamBonusFromGroupOrders = calculateTeamBonusFromGroupOrders(
    ownLevelPercent,
    input.branches,
  );
  const paid = selectPaidBonus(recommendationBonus, teamBonusFromGroupOrders);

  return {
    groupBb,
    totalBb,
    ownLevelPercent,
    branchLevels,
    levelDifferences,
    recommendationBonus,
    teamBonusFromGroupOrders,
    selectedAmount: paid.selectedAmount,
    selectedBonus: paid.selectedBonus,
    teamBonusNet: paid.teamBonusNet,
    salesVolumePerBb: BB_TO_SALES_VOLUME_RUB,
  };
}

/** Control example 1 inputs from the document (page 20). */
export function example1Input(): SuccessPlanScenarioInput {
  return {
    personalBb: 150,
    branches: Array.from({ length: 5 }, () => ({
      branchBb: 100,
      firstLevelPartnerBb: 100,
    })),
  };
}

/** Control example 2 inputs from the document (page 22). */
export function example2Input(): SuccessPlanScenarioInput {
  return {
    personalBb: 150,
    branches: Array.from({ length: 5 }, () => ({
      branchBb: 600,
      firstLevelPartnerBb: 100,
    })),
  };
}
