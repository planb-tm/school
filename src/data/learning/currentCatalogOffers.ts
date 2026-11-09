import type { Catalog, CatalogSlide } from './catalogs/types';

export type CatalogOfferStatus = 'upcoming' | 'active' | 'ended';
type OfferDates = { startDate: string | null; endDate: string | null };

export function isValidIsoDate(value: string): boolean {
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

/** Dates are inclusive. Unknown dates never make an offer appear active. */
export function getCatalogOfferStatus(offer: OfferDates, now = new Date()): CatalogOfferStatus | null {
  if (
    (offer.startDate !== null && !isValidIsoDate(offer.startDate)) ||
    (offer.endDate !== null && !isValidIsoDate(offer.endDate)) ||
    (offer.startDate !== null && offer.endDate !== null && offer.startDate > offer.endDate)
  ) return null;
  const today = localDateString(now);
  if (!today) return null;
  if (offer.startDate !== null && today < offer.startDate) return 'upcoming';
  if (offer.endDate !== null && today > offer.endDate) return 'ended';
  return offer.startDate !== null && offer.endDate !== null ? 'active' : null;
}

export function formatCatalogDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${value}T00:00:00.000Z`));
}

/** Relative public paths continue to work with the project's GitHub Pages base. */
export function catalogAssetUrl(path: string): string {
  return /^https:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path}`;
}

export function getCatalogSlides(catalog: Catalog): CatalogSlide[] {
  const slides = catalog.offers.flatMap((offer) => [
    offer.image,
    ...(offer.sections ?? []).flatMap((section) => section.type === 'gallery' ? section.slides : []),
  ]);
  return slides.filter((slide, index) => slides.findIndex((item) => item.src === slide.src) === index);
}
