import { readFileSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { catalogRegistry } from '@/data/learning/catalogs';
import type { CatalogRegistry, CatalogSlide } from '@/data/learning/catalogs/types';
import { getCatalogAssetPaths, validateCatalogRegistry } from '@/data/learning/catalogs/validation';
import { getCatalogOfferStatus, getCatalogSlides } from '@/data/learning/currentCatalogOffers';

function makeSlide(number = 1): CatalogSlide {
  return {
    number,
    title: `Slide ${number}`,
    alt: `Description of slide ${number}`,
    src: `media/example/slide-${number}.webp`,
    previewSrc: `media/example/slide-${number}-preview.webp`,
    width: 2000,
    height: 1125,
  };
}

function fixture(): CatalogRegistry {
  return {
    currentCatalogId: 'example-15',
    catalogs: [{
      id: 'example-15', number: 15, year: 2026,
      startDate: '2026-10-25', endDate: '2026-11-14', verifiedAt: '2026-11-08',
      documents: [{ id: 'official-rules', title: 'Official rules', href: 'media/example/rules.pdf' }],
      offers: [{
        id: 'example-offer', audience: 'Partners', title: 'Example offer', description: 'Verified offer description',
        startDate: '2026-10-25', endDate: '2026-11-14',
        sourceDocumentIds: ['official-rules'], image: makeSlide(),
        facts: [{ value: '30 BB', label: 'One order' }], eligibility: 'Eligible partners',
        steps: ['Place a qualifying order'], receipt: { description: 'Receive with an order', deadline: '2026-12-26' },
        conditions: ['Participation terms'],
        sections: [
          { type: 'schedule', id: 'calendar', title: 'Calendar', rows: [{ label: 'Week', title: '25–31 October', details: 'Registry date', highlight: 'Available date' }] },
          { type: 'gallery', id: 'gallery', title: 'Slides', slides: [makeSlide(2)] },
          { type: 'items', id: 'prizes', title: 'Prizes', items: [{ code: '123', name: 'Example prize' }] },
        ],
      }],
    }],
  };
}

function offerWith(patch: Record<string, unknown>): unknown {
  const base = fixture();
  const catalog = base.catalogs[0]!;
  return { ...base, catalogs: [{ ...catalog, offers: [{ ...catalog.offers[0], ...patch }] }] };
}

function expectInvalid(value: unknown, field?: string) {
  let errors: string[] = [];
  expect(() => { errors = validateCatalogRegistry(value); }).not.toThrow();
  expect(errors.length).toBeGreaterThan(0);
  if (field) expect(errors.some((error) => error.includes(field)), errors.join('\n')).toBe(true);
}

describe('catalog registry validation', () => {
  it('validates the actual published catalog records', () => {
    expect(validateCatalogRegistry(catalogRegistry)).toEqual([]);
  });

  it('accepts an empty registry and a registry with archived catalogs but no selected catalog', () => {
    expect(validateCatalogRegistry({ currentCatalogId: null, catalogs: [] })).toEqual([]);
    expect(validateCatalogRegistry({ ...fixture(), currentCatalogId: null })).toEqual([]);
  });

  it.each([undefined, null, false, 42, 'catalogs', [], {}, { catalogs: null }, { catalogs: [null, 4, []] }])(
    'reports malformed runtime data safely: %j', (value) => { expectInvalid(value); },
  );

  it.each(['id', 'number', 'year', 'verifiedAt', 'startDate', 'endDate', 'documents', 'offers'])(
    'requires catalog field %s', (field) => {
      const base = fixture();
      expectInvalid({ ...base, catalogs: [{ ...base.catalogs[0], [field]: undefined }] }, field);
    },
  );

  it.each(['id', 'audience', 'title', 'description', 'startDate', 'endDate', 'sourceDocumentIds', 'image', 'facts', 'eligibility', 'steps', 'receipt', 'conditions'])(
    'requires offer field %s', (field) => { expectInvalid(offerWith({ [field]: undefined }), field); },
  );

  it.each([
    { image: null }, { image: { ...makeSlide(), title: '' } }, { image: { ...makeSlide(), alt: '' } },
    { image: { ...makeSlide(), width: 0 } }, { image: { ...makeSlide(), height: -1 } },
    { image: { ...makeSlide(), number: 0 } }, { image: { ...makeSlide(), width: Number.NaN } },
    { facts: [null] }, { facts: [{}] }, { steps: [null] }, { conditions: [42] },
    { receipt: {} }, { sections: null }, { sections: [null] }, { sections: [{ type: 'other', id: 'x', title: 'X' }] },
    { sections: [{ type: 'schedule', id: 'x', title: 'X', rows: [null, {}] }] },
    { sections: [{ type: 'gallery', id: 'x', title: 'X', slides: [null, {}] }] },
    { sections: [{ type: 'items', id: 'x', title: 'X', items: [null, {}] }] },
  ])('validates nested offer data without a TypeError: %j', (patch) => { expectInvalid(offerWith(patch)); });

  it('requires document fields and validates source references against PDF documents', () => {
    const base = fixture();
    expectInvalid({ ...base, catalogs: [{ ...base.catalogs[0], documents: [null, {}] }] }, 'documents');
    expectInvalid(offerWith({ sourceDocumentIds: [] }), 'sourceDocumentIds');
    expectInvalid(offerWith({ sourceDocumentIds: ['missing-pdf'] }), 'sourceDocumentIds');
    expectInvalid(offerWith({ sourceDocumentIds: ['official-rules', 'official-rules'] }), 'duplicate reference');
    expectInvalid({ ...base, catalogs: [{ ...base.catalogs[0], documents: [{ id: 'official-rules', title: 'Rules', href: 'media/rules.html' }] }] }, 'unknown PDF document');
  });

  it('rejects duplicate catalog, document, offer and section ids', () => {
    const base = fixture();
    const catalog = base.catalogs[0]!;
    const offer = catalog.offers[0]!;
    expectInvalid({ ...base, catalogs: [catalog, catalog] }, 'duplicate id');
    expectInvalid({ ...base, catalogs: [{ ...catalog, documents: [...catalog.documents, ...catalog.documents] }] }, 'duplicate id');
    expectInvalid({ ...base, catalogs: [{ ...catalog, offers: [offer, offer] }] }, 'duplicate id');
    expectInvalid(offerWith({ sections: [offer.sections![0], offer.sections![0]] }), 'duplicate id');
  });

  it.each(['with space', 'id/segment', 'id:colon', 'id"quote', '<unsafe>', 'ключ'])(
    'rejects ids unsafe for HTML/aria references: %s', (id) => { expectInvalid(offerWith({ id }), '.id'); },
  );

  it('requires explicit selection and never invents a replacement current catalog', () => {
    expectInvalid({ ...fixture(), currentCatalogId: 'unknown' }, 'currentCatalogId');
    expectInvalid({ ...fixture(), currentCatalogId: undefined }, 'currentCatalogId');
    expectInvalid({ currentCatalogId: 'example-15', catalogs: [] }, 'currentCatalogId');
  });

  it.each(['2026-2-01', '2026-02-30', '2026-13-01', '2026-00-01', '', 'not-a-date'])(
    'rejects invalid ISO dates: %s', (startDate) => { expectInvalid(offerWith({ startDate }), 'startDate'); },
  );

  it('rejects reversed catalog/offer periods and invalid receipt deadlines', () => {
    const base = fixture();
    expectInvalid({ ...base, catalogs: [{ ...base.catalogs[0], endDate: '2026-10-01' }] }, 'startDate must not be after endDate');
    expectInvalid(offerWith({ endDate: '2026-10-01' }), 'startDate must not be after endDate');
    expectInvalid(offerWith({ receipt: { description: 'Receive', deadline: '2026-02-30' } }), 'receipt.deadline');
    expectInvalid(offerWith({ receipt: { description: 'Receive', deadline: '2026-10-24' } }), 'receipt.deadline');
  });

  it('allows independent participation and receipt periods after the catalog ends', () => {
    expect(validateCatalogRegistry(offerWith({ endDate: '2026-12-01' }))).toEqual([]);
    expect(validateCatalogRegistry(fixture())).toEqual([]); // Receipt is 26 December, catalog ends 14 November.
    expect(validateCatalogRegistry(offerWith({ startDate: '2026-10-01' }))).toEqual([]);
  });

  it.each([
    { startDate: null, endDate: null },
    { startDate: null, endDate: '2026-11-14' },
    { startDate: '2026-10-25', endDate: null },
  ])('requires an explanation for unknown dates and never treats them as active: %j', (dates) => {
    expectInvalid(offerWith(dates), 'dateNote');
    expectInvalid(offerWith({ ...dates, dateNote: ' ' }), 'dateNote');
    expect(validateCatalogRegistry(offerWith({ ...dates, dateNote: 'The official document gives no exact date.' }))).toEqual([]);
    expect(getCatalogOfferStatus(dates, new Date(2026, 10, 1, 12))).toBeNull();
  });

  it.each([
    '../slide.webp', 'media/../slide.webp', 'media/a..b.webp', '/media/slide.webp', 'C:/media/slide.webp',
    'media\\slide.webp', 'media/slide.webp?v=1', 'media/slide.webp#detail', '//cdn.example/slide.webp',
    'https://cdn.example/slide.webp', 'data:image/png;base64,abc', 'media/%2e%2e/slide.webp',
    'media/%252e%252e/slide.webp', 'media/%2fetc/../slide.webp', 'media/%5cslide.webp', 'media/slide.webp%3fv=1',
  ])('rejects unsafe image paths: %s', (src) => {
    expectInvalid(offerWith({ image: { ...makeSlide(), src } }), '.src');
    expectInvalid(offerWith({ image: { ...makeSlide(), previewSrc: src } }), '.previewSrc');
  });

  it.each([
    'http://oriflame.example/rules.pdf', 'javascript:alert(1)', 'https://oriflame.example/rules.html',
    '../rules.pdf', '/media/rules.pdf', 'C:/rules.pdf', 'media\\rules.pdf', 'media/rules.pdf?v=1',
    'media/rules.pdf#page=1', 'media/%2e%2e/rules.pdf', 'https://user:password@oriflame.example/rules.pdf',
  ])('rejects unsafe or non-PDF documents: %s', (href) => {
    const base = fixture();
    expectInvalid({ ...base, catalogs: [{ ...base.catalogs[0], documents: [{ id: 'official-rules', title: 'Rules', href }] }] }, '.href');
  });

  it('accepts HTTPS PDF documents and excludes remote URLs from local asset checks', () => {
    const base = fixture();
    base.catalogs[0]!.documents.push({ id: 'remote-rules', title: 'Remote PDF', href: 'https://oriflame.example/rules.pdf?v=1#page=2' });
    base.catalogs[0]!.offers[0]!.sourceDocumentIds.push('remote-rules');
    expect(validateCatalogRegistry(base)).toEqual([]);
    const paths = getCatalogAssetPaths(base);
    expect(paths).toContain('media/example/rules.pdf');
    expect(paths).toContain('media/example/slide-2-preview.webp');
    expect(paths.some((path) => path.startsWith('https://'))).toBe(false);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

const publicRoot = fileURLToPath(new URL('../../public/', import.meta.url));

describe('actual catalog assets', () => {
  it('has all local documents and images under public, with matching file types', async () => {
    const paths = getCatalogAssetPaths(catalogRegistry);
    for (const asset of paths) {
      const filename = resolve(publicRoot, asset);
      const withinPublic = relative(publicRoot, filename);
      expect(withinPublic.startsWith('..') || isAbsolute(withinPublic), asset).toBe(false);
      expect(statSync(filename).isFile(), asset).toBe(true);
      if (extname(asset).toLowerCase() === '.pdf') {
        expect(readFileSync(filename).subarray(0, 5).toString('ascii'), asset).toBe('%PDF-');
      } else {
        const metadata = await sharp(filename).metadata();
        const extension = extname(asset).slice(1).toLowerCase();
        const expectedFormat = extension === 'jpg' ? 'jpeg' : extension === 'avif' ? 'heif' : extension;
        expect(metadata.format, asset).toBe(expectedFormat);
      }
    }
  });

  it('matches original image dimensions and keeps the same preview proportions', async () => {
    for (const catalog of catalogRegistry.catalogs) {
      for (const slide of getCatalogSlides(catalog)) {
        const original = await sharp(resolve(publicRoot, slide.src)).metadata();
        expect(original.width, slide.src).toBe(slide.width);
        expect(original.height, slide.src).toBe(slide.height);
        const preview = await sharp(resolve(publicRoot, slide.previewSrc)).metadata();
        expect(preview.width ?? 0, slide.previewSrc).toBeGreaterThan(0);
        expect(preview.height ?? 0, slide.previewSrc).toBeGreaterThan(0);
        const expectedPreviewHeight = (preview.width ?? 0) * slide.height / slide.width;
        expect(Math.abs((preview.height ?? 0) - expectedPreviewHeight), slide.previewSrc).toBeLessThanOrEqual(1);
      }
    }
  });
});
