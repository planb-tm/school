import { describe, expect, it } from 'vitest';
import {
  calculateSuccessPlanScenario,
  example1Input,
  example2Input,
  tryCalculateSuccessPlanScenario,
} from '@/lib/successPlanCalculations';
import { getTeamBonusPercent } from '@/lib/teamBonusLevels';
import { parseNonNegativeNumber, parsePositiveInteger } from '@/lib/inputValidation';
import { buildScenarioExplanation } from '@/lib/scenarioExplanation';

describe('getTeamBonusPercent', () => {
  it('maps document table bands including boundaries', () => {
    expect(getTeamBonusPercent(0)).toBe(0);
    expect(getTeamBonusPercent(149)).toBe(0);
    expect(getTeamBonusPercent(150)).toBe(3);
    expect(getTeamBonusPercent(449)).toBe(3);
    expect(getTeamBonusPercent(450)).toBe(6);
    expect(getTeamBonusPercent(650)).toBe(6);
    expect(getTeamBonusPercent(899)).toBe(6);
    expect(getTeamBonusPercent(900)).toBe(9);
    expect(getTeamBonusPercent(1799)).toBe(9);
    expect(getTeamBonusPercent(1800)).toBe(12);
    expect(getTeamBonusPercent(2999)).toBe(12);
    expect(getTeamBonusPercent(3000)).toBe(15);
    expect(getTeamBonusPercent(3150)).toBe(15);
    expect(getTeamBonusPercent(4999)).toBe(15);
    expect(getTeamBonusPercent(5000)).toBe(18);
    expect(getTeamBonusPercent(7499)).toBe(18);
    expect(getTeamBonusPercent(7500)).toBe(23);
    expect(getTeamBonusPercent(10000)).toBe(23);
  });

  it('rejects negative and non-finite values', () => {
    expect(() => getTeamBonusPercent(-1)).toThrow(RangeError);
    expect(() => getTeamBonusPercent(Number.NaN)).toThrow(RangeError);
    expect(() => getTeamBonusPercent(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe('control example 1 (page 20)', () => {
  it('matches documented figures and selects recommendation bonus', () => {
    const result = calculateSuccessPlanScenario(example1Input());

    expect(result.totalBb).toBe(650);
    expect(result.ownLevelPercent).toBe(6);
    expect(result.branchLevels).toEqual([0, 0, 0, 0, 0]);
    expect(result.levelDifferences).toEqual([6, 6, 6, 6, 6]);
    expect(result.recommendationBonus).toBe(3100);
    expect(result.teamBonusFromGroupOrders).toBe(1860);
    expect(result.selectedBonus).toBe('recommendation');
    expect(result.selectedAmount).toBe(3100);
  });
});

describe('control example 2 (page 22)', () => {
  it('matches documented figures and selects team bonus', () => {
    const result = calculateSuccessPlanScenario(example2Input());

    expect(result.groupBb).toBe(3000);
    expect(result.totalBb).toBe(3150);
    expect(result.ownLevelPercent).toBe(15);
    expect(result.branchLevels).toEqual([6, 6, 6, 6, 6]);
    expect(result.levelDifferences).toEqual([9, 9, 9, 9, 9]);
    expect(result.recommendationBonus).toBe(3100);
    expect(result.teamBonusFromGroupOrders).toBe(16740);
    expect(result.selectedBonus).toBe('team');
    expect(result.selectedAmount).toBe(16740);
  });
});

describe('invalid scenario input', () => {
  it('rejects empty branches', () => {
    expect(() =>
      calculateSuccessPlanScenario({ personalBb: 150, branches: [] }),
    ).toThrow(/branches/i);
  });

  it('rejects negative personalBb', () => {
    expect(() =>
      calculateSuccessPlanScenario({
        personalBb: -10,
        branches: [{ branchBb: 100, firstLevelPartnerBb: 100 }],
      }),
    ).toThrow(RangeError);
  });

  it('rejects firstLevelPartnerBb greater than branchBb', () => {
    expect(() =>
      calculateSuccessPlanScenario({
        personalBb: 150,
        branches: [{ branchBb: 100, firstLevelPartnerBb: 200 }],
      }),
    ).toThrow(/exceed/i);
  });

  it('tryCalculate returns Russian error for invalid partner/branch pair', () => {
    const outcome = tryCalculateSuccessPlanScenario({
      personalBb: 150,
      branches: [{ branchBb: 100, firstLevelPartnerBb: 150 }],
    });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toMatch(/не могут быть больше/i);
    }
  });

  it('tryCalculate returns error for NaN personalBb', () => {
    const outcome = tryCalculateSuccessPlanScenario({
      personalBb: Number.NaN,
      branches: [{ branchBb: 100, firstLevelPartnerBb: 100 }],
    });
    expect(outcome.ok).toBe(false);
  });
});

describe('inputValidation', () => {
  it('parses non-negative numbers and rejects bad input', () => {
    expect(parseNonNegativeNumber(150, 'Личные ББ')).toEqual({
      ok: true,
      value: 150,
    });
    expect(parseNonNegativeNumber('', 'Личные ББ').ok).toBe(false);
    expect(parseNonNegativeNumber(-1, 'Личные ББ').ok).toBe(false);
    expect(parseNonNegativeNumber('abc', 'Личные ББ').ok).toBe(false);
  });

  it('parses positive integers with bounds', () => {
    expect(parsePositiveInteger(5, 'Число партнёров', { min: 1, max: 10 })).toEqual({
      ok: true,
      value: 5,
    });
    expect(parsePositiveInteger(0, 'Число партнёров', { min: 1, max: 10 }).ok).toBe(
      false,
    );
    expect(parsePositiveInteger(11, 'Число партнёров', { min: 1, max: 10 }).ok).toBe(
      false,
    );
    expect(parsePositiveInteger(1.5, 'Число партнёров', { min: 1, max: 10 }).ok).toBe(
      false,
    );
  });
});

describe('buildScenarioExplanation', () => {
  it('explains control example 1 with intermediate values', () => {
    const input = example1Input();
    const result = calculateSuccessPlanScenario(input);
    const steps = buildScenarioExplanation(input, result);
    expect(steps.length).toBeGreaterThanOrEqual(6);
    expect(steps.at(-1)?.valueLabel).toContain('3');
    const formulas = steps.map((s) => s.formula ?? '').join(' | ');
    // ru-RU grouping: 3 100 / 1 860
    expect(formulas).toMatch(/3\s?100/);
    expect(formulas).toMatch(/1\s?860/);
  });
});
