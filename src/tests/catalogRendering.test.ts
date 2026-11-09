import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CatalogOffers } from '@/components/CurrentCatalogOffers';
import { catalog2026_15 } from '@/data/learning/catalogs/2026-15';
import type { Catalog } from '@/data/learning/catalogs/types';

function render(now: Date, catalog: Catalog = catalog2026_15) {
  return renderToStaticMarkup(createElement(CatalogOffers, { catalog, now }));
}

describe('catalog presentation', () => {
  it('keeps the last participation day active', () => {
    const html = render(new Date(2026, 10, 14, 12));
    expect(html.match(/>Действует</g)).toHaveLength(2);
    expect(html).not.toContain('Участие завершено');
  });

  it('keeps receipt available after participation has ended', () => {
    const html = render(new Date(2026, 10, 15, 12));
    expect(html.match(/Участие завершено/g)).toHaveLength(2);
    expect(html).toContain('Получение до');
    expect(html).toContain('26 декабря 2026');
    expect(html).not.toContain('Срок получения завершён');
    expect(html).toContain('campaign-conditions.pdf');
  });

  it('marks receipt separately after its own final day', () => {
    expect(render(new Date(2026, 11, 26, 12))).not.toContain('Срок получения завершён');
    expect(render(new Date(2026, 11, 27, 12))).toContain('Срок получения завершён');
  });

  it('uses the same template for a catalog with different offers and no optional blocks', () => {
    const catalog: Catalog = {
      ...catalog2026_15,
      offers: [{ ...catalog2026_15.offers[0], id: 'different-id', sections: [] }],
    };
    const html = render(new Date(2026, 10, 9, 12), catalog);
    expect(html).toContain('different-id-title');
    expect(html).not.toContain('Все 13 вариантов призов');
    expect(html).not.toContain('Уточнения к материалам кампании');
  });
});
