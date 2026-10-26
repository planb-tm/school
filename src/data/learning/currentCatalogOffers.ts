export type CurrentCatalogOffer = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  conditions: string[];
  officialUrl: string;
  lastVerifiedAt: string;
  limitations?: string;
};

export type CatalogCycleImage = {
  path: string;
  alt: string;
  caption?: string;
};

/** Offers and any verified imagery belong to their catalog period. */
export type CatalogCycle = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  images?: CatalogCycleImage[];
  offers: CurrentCatalogOffer[];
};

/**
 * Add catalog periods and their offers only from official Oriflame sources.
 * Keep each offer attached to its catalog cycle; include verified dates,
 * conditions, direct official URLs and lastVerifiedAt. GitHub Pages serves
 * this static file, so edits require a new site deployment.
 */
export const catalogCycles: CatalogCycle[] = [];

export function getCurrentCatalogCycle(
  cycles: readonly CatalogCycle[] = catalogCycles,
  now = new Date(),
): CatalogCycle | null {
  return (
    cycles.find((cycle) => {
      const cycleStatus = getCatalogOfferStatus(cycle, now);
      return cycleStatus === 'active';
    }) ?? null
  );
}

export type CatalogOfferStatus = 'upcoming' | 'active' | 'ended';

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function localDateString(date: Date): string | null {
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Returns null when an offer has missing, invalid or reversed dates. */
export function getCatalogOfferStatus(
  offer: Pick<CurrentCatalogOffer, 'startDate' | 'endDate'>,
  now = new Date(),
): CatalogOfferStatus | null {
  if (
    !isValidIsoDate(offer.startDate) ||
    !isValidIsoDate(offer.endDate) ||
    offer.startDate > offer.endDate
  ) {
    return null;
  }

  const today = localDateString(now);
  if (!today) return null;
  if (today < offer.startDate) return 'upcoming';
  if (today > offer.endDate) return 'ended';
  return 'active';
}
