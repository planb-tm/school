import { CurrentCatalogOffers } from '@/components/CurrentCatalogOffers';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';

export function CatalogOffersPage() {
  return (
    <PageContainer>
      <PageHeader title="Акции текущего каталога" backTo="/" id="catalog-offers-title" />
      <CurrentCatalogOffers />
    </PageContainer>
  );
}
