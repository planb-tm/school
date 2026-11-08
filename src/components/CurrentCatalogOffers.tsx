import {
  getCurrentCatalogCycle,
  getCatalogOfferStatus,
} from '@/data/learning/currentCatalogOffers';

const STATUS_LABELS = {
  upcoming: 'Скоро начнётся',
  active: 'Действует',
  ended: 'Завершено',
} as const;

const officialOffersUrl = 'https://oriflame.ru/offer/akcii';
const catalogDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatCatalogDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : catalogDateFormatter.format(date);
}

type Props = { embedded?: boolean };

export function CurrentCatalogOffers({ embedded = false }: Props) {
  const cycle = getCurrentCatalogCycle();
  const wrapperClass = embedded ? 'stack' : 'panel panel--soft';

  return (
    <section className={wrapperClass} aria-labelledby="current-offers-title">
      <header className="panel__header">
        <h3 id="current-offers-title">
          {cycle ? `Предложения каталога: ${cycle.name}` : 'Предложения каталога'}
        </h3>
        <p>
          {cycle
            ? `Период каталога: ${formatCatalogDate(cycle.startDate)} — ${formatCatalogDate(cycle.endDate)} Проверяйте условия перед заказом.`
            : 'Предложения будут показаны здесь после проверки официальных условий и периода каталога.'}
        </p>
      </header>

      {cycle?.images?.length ? (
        <div className="stack">
          {cycle.images.map((image) => (
            <figure key={image.path}>
              <img src={image.path} alt={image.alt} loading="lazy" />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}

      {!cycle || cycle.offers.length === 0 ? (
        <div className="callout" role="status">
          <p>Проверенная информация о предложениях текущего каталога ещё не добавлена.</p>
          <a
            className="external-links__item"
            href={officialOffersUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Проверить акции на официальном сайте
          </a>
        </div>
      ) : (
        <div className="stack">
          {cycle.offers.map((offer) => {
            const status = getCatalogOfferStatus(offer);
            return (
              <article key={offer.id} className="callout">
                <p className="eyebrow">
                  {status ? STATUS_LABELS[status] : 'Статус не определён - проверьте даты'}
                </p>
                <h3 className="currentOfferTitle">{offer.name}</h3>
                <p>{offer.description}</p>
                <p className="info-list__desc">
                  Период: {formatCatalogDate(offer.startDate)} — {formatCatalogDate(offer.endDate)}
                </p>
                <ul className="plain-list">
                  {offer.conditions.map((condition) => (
                    <li key={condition}>{condition}</li>
                  ))}
                </ul>
                {offer.limitations ? <p>{offer.limitations}</p> : null}
                <p className="info-list__desc">
                  Последняя проверка: {formatCatalogDate(offer.lastVerifiedAt)}
                </p>
                <a
                  className="external-links__item"
                  href={offer.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Официальный источник
                </a>
              </article>
            );
          })}
          <a
            className="external-links__item"
            href={officialOffersUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Посмотреть все акции на сайте Oriflame
          </a>
        </div>
      )}
    </section>
  );
}
