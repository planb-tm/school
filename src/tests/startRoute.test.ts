import { describe, expect, it } from 'vitest';
import { learningCatalog } from '@/data/learning/catalog';
import { firstOrderStages } from '@/data/learning/firstOrder';
import { toolsCatalog } from '@/data/tools/catalog';
import { START_ROUTE_PATH, startRouteSteps } from '@/data/startRoute';

describe('recommended start route', () => {
  it('contains the three available learning destinations in the intended order', () => {
    expect(START_ROUTE_PATH).toBe('/start');

    const learningSteps = startRouteSteps.slice(0, 3);
    expect(learningSteps.map((step) => step.learningItemId)).toEqual([
      'business-essence',
      'first-order',
      'inviting-objections',
    ]);

    for (const step of learningSteps) {
      const item = learningCatalog.find((entry) => entry.id === step.learningItemId);
      expect(item?.status).toBe('available');
      expect(item?.path).toBeTruthy();
    }
  });

  it('can derive the first-order draft notice from existing stage data', () => {
    expect(firstOrderStages.some((stage) => stage.status === 'draft')).toBe(true);
  });

  it('ends with an optional link to the existing tools catalogue', () => {
    const lastStep = startRouteSteps.at(-1);

    expect(lastStep).toMatchObject({ id: 'tools', path: '/tools', optional: true });
    expect(toolsCatalog.length).toBeGreaterThan(0);
    expect(toolsCatalog.every((tool) => tool.path)).toBe(true);
  });
});
