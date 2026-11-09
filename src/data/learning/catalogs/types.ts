/** ISO calendar dates (YYYY-MM-DD), inclusive, checked by catalog validation. */
export type CatalogPeriod = { startDate: string; endDate: string };

/** Paths are relative to public/ or absolute HTTPS URLs for official PDFs. */
export type CatalogDocument = {
  id: string;
  title: string;
  href: string;
  description?: string;
};

export type CatalogSlide = {
  number: number;
  title: string;
  alt: string;
  src: string;
  previewSrc: string;
  width: number;
  height: number;
};

/** Optional content blocks use the same rendering rules for every offer. */
export type CatalogOfferSection =
  | {
      type: 'schedule';
      id: string;
      title: string;
      caption?: string;
      rows: { label: string; title: string; details: string; highlight: string }[];
      note?: string;
    }
  | {
      type: 'gallery';
      id: string;
      title: string;
      caption?: string;
      slides: CatalogSlide[];
    }
  | {
      type: 'items';
      id: string;
      title: string;
      description?: string;
      items: { code: string; name: string }[];
    };

export type CatalogOffer = {
  id: string;
  audience: string;
  title: string;
  description: string;
  /** Never inherited from the catalog. Null means the document gives no exact date. */
  startDate: string | null;
  endDate: string | null;
  /** Required if either participation date is unknown. */
  dateNote?: string;
  sourceDocumentIds: string[];
  image: CatalogSlide;
  facts: { value: string; label: string }[];
  eligibility: string;
  steps: string[];
  receipt: { description: string; deadline?: string };
  conditions: string[];
  sections?: CatalogOfferSection[];
};

export type Catalog = CatalogPeriod & {
  id: string;
  number: number;
  year: number;
  verifiedAt: string;
  documents: CatalogDocument[];
  offers: CatalogOffer[];
};

export type CatalogRegistry = {
  currentCatalogId: string | null;
  catalogs: Catalog[];
};
