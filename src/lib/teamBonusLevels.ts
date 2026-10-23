/**
 * Team bonus % levels from personal-group Bonus Points (ББ).
 * Source: «План Успеха 2026», page 21.
 *
 * Scope limitation: this table alone does not cover all qualification
 * conditions, 23% group carve-outs, or Director bonuses.
 */

export interface TeamBonusLevelBand {
  minBb: number;
  maxBb: number | null;
  percent: number;
}

export const TEAM_BONUS_LEVELS: readonly TeamBonusLevelBand[] = [
  { minBb: 0, maxBb: 149, percent: 0 },
  { minBb: 150, maxBb: 449, percent: 3 },
  { minBb: 450, maxBb: 899, percent: 6 },
  { minBb: 900, maxBb: 1799, percent: 9 },
  { minBb: 1800, maxBb: 2999, percent: 12 },
  { minBb: 3000, maxBb: 4999, percent: 15 },
  { minBb: 5000, maxBb: 7499, percent: 18 },
  { minBb: 7500, maxBb: null, percent: 23 },
] as const;

/** Returns team-bonus percent for a given Bonus Point total. */
export function getTeamBonusPercent(bonusPoints: number): number {
  if (!Number.isFinite(bonusPoints) || bonusPoints < 0) {
    throw new RangeError('bonusPoints must be a non-negative finite number');
  }

  for (const band of TEAM_BONUS_LEVELS) {
    const withinMax = band.maxBb === null || bonusPoints <= band.maxBb;
    if (bonusPoints >= band.minBb && withinMax) {
      return band.percent;
    }
  }

  throw new Error(`No team-bonus level for ${bonusPoints} ББ`);
}
