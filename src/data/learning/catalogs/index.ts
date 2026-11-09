import { catalog2026_15 } from './2026-15';
import type { Catalog, CatalogRegistry } from './types';

export const catalogRegistry = {
  currentCatalogId: '2026-15',
  catalogs: [catalog2026_15],
} satisfies CatalogRegistry;

export function getSelectedCatalog(registry: CatalogRegistry = catalogRegistry): Catalog | null {
  if (registry.currentCatalogId === null) return null;
  return registry.catalogs.find((catalog) => catalog.id === registry.currentCatalogId) ?? null;
}

export function getArchivedCatalogs(registry: CatalogRegistry = catalogRegistry): Catalog[] {
  return registry.catalogs.filter((catalog) => catalog.id !== registry.currentCatalogId);
}
