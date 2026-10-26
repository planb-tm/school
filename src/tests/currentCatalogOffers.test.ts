import { describe, expect, it } from 'vitest';
import {
  getCatalogOfferStatus,
  getCurrentCatalogCycle,
  type CatalogCycle,
} from '@/data/learning/currentCatalogOffers';

describe('getCatalogOfferStatus', () => {
  it('marks a valid offer that has not started yet', () => {
    expect(
      getCatalogOfferStatus(
        { startDate: '2026-10-20', endDate: '2026-10-31' },
        new Date(2026, 9, 19, 12),
      ),
    ).toBe('upcoming');
  });

  it('includes both boundary dates in the active period', () => {
    const offer = { startDate: '2026-10-20', endDate: '2026-10-31' };
    expect(getCatalogOfferStatus(offer, new Date(2026, 9, 20, 12))).toBe('active');
    expect(getCatalogOfferStatus(offer, new Date(2026, 9, 31, 12))).toBe('active');
  });

  it('marks an offer after its end date as ended', () => {
    expect(
      getCatalogOfferStatus(
        { startDate: '2026-10-20', endDate: '2026-10-31' },
        new Date(2026, 10, 1, 12),
      ),
    ).toBe('ended');
  });

  it.each([
    { startDate: '', endDate: '2026-10-31' },
    { startDate: '2026-10-20', endDate: '' },
    { startDate: '2026-02-30', endDate: '2026-10-31' },
    { startDate: '2026-11-01', endDate: '2026-10-31' },
  ])('does not assign a status when dates are invalid: $startDate - $endDate', (offer) => {
    expect(getCatalogOfferStatus(offer, new Date(2026, 9, 24))).toBeNull();
  });
});

describe('getCurrentCatalogCycle', () => {
  const cycles: CatalogCycle[] = [
    {
      id: 'previous',
      name: 'Предыдущий каталог',
      startDate: '2026-10-01',
      endDate: '2026-10-10',
      offers: [],
    },
    {
      id: 'current',
      name: 'Текущий каталог',
      startDate: '2026-10-20',
      endDate: '2026-10-31',
      offers: [],
    },
  ];

  it('returns the catalog period containing today', () => {
    expect(getCurrentCatalogCycle(cycles, new Date(2026, 9, 24))?.id).toBe('current');
  });

  it('returns null when no catalog period is active', () => {
    expect(getCurrentCatalogCycle(cycles, new Date(2026, 10, 1))).toBeNull();
  });
});
