import { describe, expect, it } from 'vitest';
import { getCatalogOfferStatus } from '@/data/learning/currentCatalogOffers';
import { getArchivedCatalogs, getSelectedCatalog } from '@/data/learning/catalogs';
import type { Catalog, CatalogRegistry } from '@/data/learning/catalogs/types';

describe('getCatalogOfferStatus', () => {
  it('marks a valid offer that has not started yet', () => {
    expect(getCatalogOfferStatus(
      { startDate: '2026-10-20', endDate: '2026-10-31' },
      new Date(2026, 9, 19, 12),
    )).toBe('upcoming');
  });

  it('includes both boundary dates in the active period', () => {
    const offer = { startDate: '2026-10-20', endDate: '2026-10-31' };
    expect(getCatalogOfferStatus(offer, new Date(2026, 9, 20, 12))).toBe('active');
    expect(getCatalogOfferStatus(offer, new Date(2026, 9, 31, 12))).toBe('active');
  });

  it('marks an offer after its end date as ended', () => {
    expect(getCatalogOfferStatus(
      { startDate: '2026-10-20', endDate: '2026-10-31' },
      new Date(2026, 10, 1, 12),
    )).toBe('ended');
  });

  it.each([
    { startDate: '', endDate: '2026-10-31' },
    { startDate: '2026-10-20', endDate: '' },
    { startDate: '2026-02-30', endDate: '2026-10-31' },
    { startDate: '2025-02-29', endDate: '2025-03-01' },
    { startDate: '2026-11-01', endDate: '2026-10-31' },
  ])('does not assign a status when dates are invalid: $startDate - $endDate', (offer) => {
    expect(getCatalogOfferStatus(offer, new Date(2026, 9, 24))).toBeNull();
  });

  it('does not turn unknown participation dates into an active period', () => {
    const now = new Date(2026, 10, 1, 12);
    expect(getCatalogOfferStatus({ startDate: null, endDate: null }, now)).toBeNull();
    expect(getCatalogOfferStatus({ startDate: '2026-10-25', endDate: null }, now)).toBeNull();
    expect(getCatalogOfferStatus({ startDate: null, endDate: '2026-11-14' }, now)).toBeNull();
  });

  it('uses a known single boundary only to identify upcoming or ended offers', () => {
    const now = new Date(2026, 10, 1, 12);
    expect(getCatalogOfferStatus({ startDate: '2026-11-02', endDate: null }, now)).toBe('upcoming');
    expect(getCatalogOfferStatus({ startDate: null, endDate: '2026-10-31' }, now)).toBe('ended');
  });

  it('rejects an invalid current date', () => {
    expect(getCatalogOfferStatus({ startDate: '2026-10-25', endDate: '2026-11-14' }, new Date(Number.NaN))).toBeNull();
  });
});

function catalog(id: string, startDate: string, endDate: string): Catalog {
  return { id, number: 1, year: 2026, startDate, endDate, verifiedAt: '2026-11-08', documents: [], offers: [] };
}

describe('explicit catalog selection and archives', () => {
  const previous = catalog('previous', '2020-01-01', '2020-01-31');
  const future = catalog('future', '2099-01-01', '2099-01-31');
  const registry: CatalogRegistry = { currentCatalogId: 'previous', catalogs: [previous, future] };

  it('returns the explicitly selected catalog without selecting by today or latest year', () => {
    expect(getSelectedCatalog(registry)).toBe(previous);
    expect(getSelectedCatalog({ ...registry, currentCatalogId: 'future' })).toBe(future);
  });

  it('does not silently replace a missing selection with another catalog', () => {
    expect(getSelectedCatalog({ ...registry, currentCatalogId: 'missing' })).toBeNull();
    expect(getSelectedCatalog({ ...registry, currentCatalogId: null })).toBeNull();
    expect(getSelectedCatalog({ currentCatalogId: null, catalogs: [] })).toBeNull();
  });

  it('archives all non-selected records without deriving status from dates', () => {
    expect(getArchivedCatalogs(registry)).toEqual([future]);
    expect(getArchivedCatalogs({ ...registry, currentCatalogId: 'future' })).toEqual([previous]);
    expect(getArchivedCatalogs({ ...registry, currentCatalogId: null })).toEqual([previous, future]);
    expect(getArchivedCatalogs({ currentCatalogId: null, catalogs: [] })).toEqual([]);
  });
});
