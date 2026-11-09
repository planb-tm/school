import { isValidIsoDate } from '../currentCatalogOffers';
import type { CatalogRegistry } from './types';

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLocalPublicPath(value: string): boolean {
  if (!value || value !== value.trim()) return false;
  let decoded = value;
  try {
    for (let pass = 0; pass < 3; pass += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    return false;
  }
  return !decoded.startsWith('/') &&
    !/^[a-z][a-z\d+.-]*:/i.test(decoded) &&
    !/[\\?#%\u0000-\u001f\u007f]/.test(decoded) &&
    !decoded.includes('..') &&
    !decoded.split('/').some((segment) => segment === '' || segment === '.');
}

function isPdfHref(value: string): boolean {
  if (value.startsWith('https://')) {
    try {
      const url = new URL(value);
      return value === value.trim() && !value.includes('\\') &&
        url.protocol === 'https:' && Boolean(url.hostname) &&
        !url.username && !url.password && /\.pdf$/i.test(url.pathname);
    } catch {
      return false;
    }
  }
  return isLocalPublicPath(value) && /\.pdf$/i.test(value);
}

/** Reports invalid nested data without assuming that the input already has TS types. */
export function validateCatalogRegistry(value: unknown): string[] {
  const errors: string[] = [];
  const fail = (path: string, message: string) => { errors.push(`${path}: ${message}`); };

  function record(input: unknown, path: string): RecordValue | null {
    if (isRecord(input)) return input;
    fail(path, 'must be an object');
    return null;
  }

  function array(input: unknown, path: string): unknown[] {
    if (Array.isArray(input)) return input;
    fail(path, 'must be an array');
    return [];
  }

  function text(input: unknown, path: string): input is string {
    if (typeof input === 'string' && input.trim().length > 0) return true;
    fail(path, 'must be a non-empty string');
    return false;
  }

  function optionalText(input: unknown, path: string) {
    if (input !== undefined && typeof input !== 'string') fail(path, 'must be a string when provided');
  }

  function positiveInteger(input: unknown, path: string) {
    if (typeof input !== 'number' || !Number.isInteger(input) || input <= 0) {
      fail(path, 'must be a positive integer');
    }
  }

  function date(input: unknown, path: string, nullable = false): input is string {
    if (nullable && input === null) return false;
    if (typeof input === 'string' && isValidIsoDate(input)) return true;
    fail(path, nullable ? 'must be an ISO date (YYYY-MM-DD) or null' : 'must be an ISO date (YYYY-MM-DD)');
    return false;
  }

  function period(input: RecordValue, path: string, nullable = false) {
    const startValid = date(input.startDate, `${path}.startDate`, nullable);
    const endValid = date(input.endDate, `${path}.endDate`, nullable);
    if (startValid && endValid && (input.startDate as string) > (input.endDate as string)) {
      fail(path, 'startDate must not be after endDate');
    }
  }

  function uniqueId(input: unknown, path: string, seen: Set<string>): string | null {
    if (!text(input, path)) return null;
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(input)) fail(path, 'must use letters, digits, underscores or hyphens without spaces');
    if (seen.has(input)) fail(path, `duplicate id "${input}"`);
    seen.add(input);
    return input;
  }

  function textList(input: unknown, path: string, nonEmpty = false): string[] {
    const values = array(input, path);
    if (nonEmpty && values.length === 0) fail(path, 'must contain at least one value');
    const valid: string[] = [];
    values.forEach((item, index) => {
      if (text(item, `${path}[${index}]`)) valid.push(item);
    });
    return valid;
  }

  function slide(input: unknown, path: string) {
    const item = record(input, path);
    if (!item) return;
    positiveInteger(item.number, `${path}.number`);
    text(item.title, `${path}.title`);
    text(item.alt, `${path}.alt`);
    positiveInteger(item.width, `${path}.width`);
    positiveInteger(item.height, `${path}.height`);
    for (const key of ['src', 'previewSrc'] as const) {
      if (text(item[key], `${path}.${key}`) &&
        (!isLocalPublicPath(item[key]) || !/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(item[key]))) {
        fail(`${path}.${key}`, 'must be a safe relative public image path');
      }
    }
  }

  function section(input: unknown, path: string, ids: Set<string>) {
    const item = record(input, path);
    if (!item) return;
    uniqueId(item.id, `${path}.id`, ids);
    text(item.title, `${path}.title`);
    optionalText(item.caption, `${path}.caption`);
    if (item.type === 'schedule') {
      array(item.rows, `${path}.rows`).forEach((row, index) => {
        const rowPath = `${path}.rows[${index}]`;
        const entry = record(row, rowPath);
        if (!entry) return;
        for (const field of ['label', 'title', 'details', 'highlight']) text(entry[field], `${rowPath}.${field}`);
      });
      optionalText(item.note, `${path}.note`);
    } else if (item.type === 'gallery') {
      array(item.slides, `${path}.slides`).forEach((entry, index) => slide(entry, `${path}.slides[${index}]`));
    } else if (item.type === 'items') {
      optionalText(item.description, `${path}.description`);
      const codes = new Set<string>();
      array(item.items, `${path}.items`).forEach((entry, index) => {
        const itemPath = `${path}.items[${index}]`;
        const product = record(entry, itemPath);
        if (!product) return;
        uniqueId(product.code, `${itemPath}.code`, codes);
        text(product.name, `${itemPath}.name`);
      });
    } else {
      fail(`${path}.type`, 'must be schedule, gallery or items');
    }
  }

  function offer(input: unknown, path: string, ids: Set<string>, pdfDocumentIds: Set<string>) {
    const item = record(input, path);
    if (!item) return;
    uniqueId(item.id, `${path}.id`, ids);
    for (const field of ['audience', 'title', 'description', 'eligibility']) text(item[field], `${path}.${field}`);
    period(item, path, true);
    optionalText(item.dateNote, `${path}.dateNote`);
    if (item.startDate === null || item.endDate === null) text(item.dateNote, `${path}.dateNote`);
    const references = textList(item.sourceDocumentIds, `${path}.sourceDocumentIds`, true);
    const seenReferences = new Set<string>();
    references.forEach((id, index) => {
      const refPath = `${path}.sourceDocumentIds[${index}]`;
      if (!pdfDocumentIds.has(id)) fail(refPath, `unknown PDF document "${id}"`);
      if (seenReferences.has(id)) fail(refPath, `duplicate reference "${id}"`);
      seenReferences.add(id);
    });
    slide(item.image, `${path}.image`);
    array(item.facts, `${path}.facts`).forEach((fact, index) => {
      const factPath = `${path}.facts[${index}]`;
      const entry = record(fact, factPath);
      if (entry) {
        text(entry.value, `${factPath}.value`);
        text(entry.label, `${factPath}.label`);
      }
    });
    textList(item.steps, `${path}.steps`);
    textList(item.conditions, `${path}.conditions`);
    const receipt = record(item.receipt, `${path}.receipt`);
    if (receipt) {
      text(receipt.description, `${path}.receipt.description`);
      if (receipt.deadline !== undefined && date(receipt.deadline, `${path}.receipt.deadline`) &&
        typeof item.startDate === 'string' && isValidIsoDate(item.startDate) && receipt.deadline < item.startDate) {
        fail(`${path}.receipt.deadline`, 'must not be before the offer startDate');
      }
    }
    if (item.sections !== undefined) {
      const sectionIds = new Set<string>();
      array(item.sections, `${path}.sections`).forEach((entry, index) => section(entry, `${path}.sections[${index}]`, sectionIds));
    }
  }

  const registry = record(value, 'registry');
  if (!registry) return errors;
  const catalogs = array(registry.catalogs, 'registry.catalogs');
  const catalogIds = new Set<string>();
  catalogs.forEach((input, index) => {
    const path = `registry.catalogs[${index}]`;
    const item = record(input, path);
    if (!item) return;
    uniqueId(item.id, `${path}.id`, catalogIds);
    positiveInteger(item.number, `${path}.number`);
    positiveInteger(item.year, `${path}.year`);
    date(item.verifiedAt, `${path}.verifiedAt`);
    period(item, path);
    const documentIds = new Set<string>();
    const pdfDocumentIds = new Set<string>();
    array(item.documents, `${path}.documents`).forEach((inputDocument, docIndex) => {
      const docPath = `${path}.documents[${docIndex}]`;
      const document = record(inputDocument, docPath);
      if (!document) return;
      const id = uniqueId(document.id, `${docPath}.id`, documentIds);
      text(document.title, `${docPath}.title`);
      optionalText(document.description, `${docPath}.description`);
      if (text(document.href, `${docPath}.href`)) {
        if (isPdfHref(document.href)) {
          if (id) pdfDocumentIds.add(id);
        } else fail(`${docPath}.href`, 'must be an HTTPS PDF URL or a safe relative public PDF path');
      }
    });
    const offerIds = new Set<string>();
    array(item.offers, `${path}.offers`).forEach((entry, offerIndex) => offer(entry, `${path}.offers[${offerIndex}]`, offerIds, pdfDocumentIds));
  });
  if (catalogs.length === 0) {
    if (registry.currentCatalogId !== null) fail('registry.currentCatalogId', 'must be null when catalogs is empty');
  } else if (registry.currentCatalogId !== null && text(registry.currentCatalogId, 'registry.currentCatalogId') && !catalogIds.has(registry.currentCatalogId)) {
    fail('registry.currentCatalogId', `unknown catalog "${registry.currentCatalogId}"`);
  }
  return errors;
}

/** Local files only; callers can check them under public/ without fetching remote PDFs. */
export function getCatalogAssetPaths(registry: CatalogRegistry): string[] {
  const paths = new Set<string>();
  for (const catalog of registry.catalogs) {
    for (const document of catalog.documents) {
      if (!document.href.startsWith('https://')) paths.add(document.href);
    }
    for (const offer of catalog.offers) {
      paths.add(offer.image.src);
      paths.add(offer.image.previewSrc);
      for (const section of offer.sections ?? []) {
        if (section.type !== 'gallery') continue;
        for (const slide of section.slides) {
          paths.add(slide.src);
          paths.add(slide.previewSrc);
        }
      }
    }
  }
  return [...paths];
}
