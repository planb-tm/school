import { Link } from 'react-router-dom';
import { CurrentCatalogOffers } from '@/components/CurrentCatalogOffers';

export function CatalogOffersPage() {
  return (
    <div className="tools-page">
      <Link to="/" className="tools-back">Назад</Link>

      <header className="home-intro">
        <h1 id="catalog-offers-title" className="section-title">
          Акции текущего каталога
        </h1>
        <p className="home-intro__lead">
          Условия специальных предложений, сроки и ссылки на официальные правила.
          Перед заказом проверь наличие товаров и актуальные условия на сайте Oriflame.
        </p>
      </header>

      <CurrentCatalogOffers />
    </div>
  );
}
