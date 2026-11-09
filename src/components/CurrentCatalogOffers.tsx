import { useEffect, useRef, useState } from 'react';
import { getSelectedCatalog } from '@/data/learning/catalogs';
import type { Catalog, CatalogOffer, CatalogOfferSection, CatalogSlide } from '@/data/learning/catalogs/types';
import { catalogAssetUrl, formatCatalogDate, getCatalogOfferStatus, getCatalogSlides } from '@/data/learning/currentCatalogOffers';
import { IconArrowUpRight } from './Icons';
import styles from './CurrentCatalogOffers.module.css';

function SlideButton({ slide, onOpen, thumbnail = false, priority = false }: {
  slide: CatalogSlide;
  onOpen: (slide: CatalogSlide) => void;
  thumbnail?: boolean;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      className={thumbnail ? styles.thumbnail : styles.slideButton}
      onClick={() => onOpen(slide)}
      aria-label={`Увеличить слайд ${slide.number}: ${slide.title}`}
      aria-haspopup="dialog"
    >
      <img
        src={catalogAssetUrl(slide.previewSrc)}
        width={slide.width}
        height={slide.height}
        alt={slide.alt}
        loading={priority ? 'eager' : 'lazy'}
      />
      <span className={styles.slideCaption}>
        <span>{slide.title}</span>
        <IconArrowUpRight size={17} />
      </span>
    </button>
  );
}

function OfferSection({ section, onOpen, offerId }: {
  section: CatalogOfferSection;
  onOpen: (slide: CatalogSlide) => void;
  offerId: string;
}) {
  const headingId = `${offerId}-${section.id}-title`;
  if (section.type === 'items') {
    return (
      <details className={styles.details}>
        <summary>{section.title}</summary>
        {section.description ? <p className={styles.prizeIntro}>{section.description}</p> : null}
        <ul className={styles.prizes}>
          {section.items.map((item) => (
            <li key={item.code}><span>{item.name}</span><small>Код {item.code}</small></li>
          ))}
        </ul>
      </details>
    );
  }
  return (
    <section className={section.type === 'schedule' ? styles.calendar : styles.materials} aria-labelledby={headingId}>
      <div className={styles.sectionHeading}>
        <h3 id={headingId}>{section.title}</h3>
        {section.caption ? <span>{section.caption}</span> : null}
      </div>
      {section.type === 'schedule' ? (
        <>
          <div className={styles.calendarGrid}>
            {section.rows.map((row) => (
              <div className={styles.calendarWeek} key={row.title}>
                <p>{row.label}</p><h4>{row.title}</h4>
                <p>{row.details}</p><strong>{row.highlight}</strong>
              </div>
            ))}
          </div>
          {section.note ? <p className={styles.calendarNote}>{section.note}</p> : null}
        </>
      ) : (
        <div className={styles.gallery}>
          {section.slides.map((slide) => <SlideButton key={slide.src} slide={slide} onOpen={onOpen} thumbnail />)}
        </div>
      )}
    </section>
  );
}

function Offer({ offer, onOpen, now, priority = false }: {
  offer: CatalogOffer;
  onOpen: (slide: CatalogSlide) => void;
  now: Date;
  priority?: boolean;
}) {
  const status = getCatalogOfferStatus(offer, now);
  const receiptEnded = offer.receipt.deadline
    ? getCatalogOfferStatus({ startDate: null, endDate: offer.receipt.deadline }, now) === 'ended'
    : false;
  return (
    <article className={styles.offer} aria-labelledby={`${offer.id}-title`}>
      <SlideButton slide={offer.image} onOpen={onOpen} priority={priority} />
      <div className={styles.offerBody}>
        <header className={styles.offerHeading}>
          <p className={styles.audience}>{offer.audience}</p>
          <h2 id={`${offer.id}-title`}>{offer.title}</h2>
          <p>{offer.description}</p>
          <div className={styles.offerPeriod}>
            {status === 'ended' ? <strong className={styles.status}>Участие завершено</strong>
              : status === 'upcoming' ? <strong className={styles.status}>Скоро</strong>
                : status === 'active' ? <strong className={styles.status}>Действует</strong> : null}
            {offer.startDate && offer.endDate ? (
              <span>Участие: {formatCatalogDate(offer.startDate)} - {formatCatalogDate(offer.endDate)}</span>
            ) : offer.dateNote ? <span>{offer.dateNote}</span> : null}
          </div>
        </header>

        {offer.facts.length ? <dl className={styles.facts}>
          {offer.facts.map((fact) => (
            <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
          ))}
        </dl> : null}

        <div className={styles.eligibility}>
          <h3>Для кого</h3>
          <p>{offer.eligibility}</p>
        </div>

        <div className={styles.instructions}>
          <section aria-labelledby={`${offer.id}-steps`}>
            <h3 id={`${offer.id}-steps`}>Как участвовать</h3>
            <ol className={styles.steps}>
              {offer.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>
          <section className={styles.receipt} aria-labelledby={`${offer.id}-receipt`}>
            <h3 id={`${offer.id}-receipt`}>Когда и как получить</h3>
            <p>{offer.receipt.description}</p>
            {offer.receipt.deadline ? (
              <p className={styles.deadline}>
                {receiptEnded ? 'Срок получения завершён' : 'Получение до'}
                <strong>{formatCatalogDate(offer.receipt.deadline)}</strong>
              </p>
            ) : null}
          </section>
        </div>

        {offer.sections?.map((section) => <OfferSection key={section.id} section={section} offerId={offer.id} onOpen={onOpen} />)}

        <details className={styles.details}>
          <summary>Важные условия и исключения</summary>
          <ul className={styles.conditions}>
            {offer.conditions.map((condition) => <li key={condition}>{condition}</li>)}
          </ul>
        </details>
      </div>
    </article>
  );
}

export function CurrentCatalogOffers() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0);
    const refresh = () => setNow(new Date());
    const resume = () => { if (document.visibilityState === 'visible') refresh(); };
    const timer = window.setTimeout(refresh, Math.max(0, nextDay.getTime() - Date.now()));
    document.addEventListener('visibilitychange', resume);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [now]);
  const catalog = getSelectedCatalog();
  return catalog ? <CatalogOffers catalog={catalog} now={now} /> : <p>Материалы текущего каталога пока не опубликованы.</p>;
}

/** One template for any catalog; dates are injectable for boundary checks. */
export function CatalogOffers({ catalog, now = new Date() }: { catalog: Catalog; now?: Date }) {
  const [activeSlide, setActiveSlide] = useState<CatalogSlide | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageViewportRef = useRef<HTMLDivElement>(null);
  const allSlides = getCatalogSlides(catalog);
  const isOpen = activeSlide !== null;
  const activeIndex = allSlides.findIndex((slide) => slide.src === activeSlide?.src);
  const status = getCatalogOfferStatus(catalog, now);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!isOpen) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  function openSlide(slide: CatalogSlide) {
    setActiveSlide(slide);
    setZoomed(false);
    imageViewportRef.current?.scrollTo(0, 0);
  }

  return (
    <div className={styles.showcase}>
      <div className={styles.catalogInfo} aria-label="Период каталога">
        <span className={styles.catalogLabel}>Каталог №{catalog.number} · {catalog.year}</span>
        <span>{formatCatalogDate(catalog.startDate)} - {formatCatalogDate(catalog.endDate)}</span>
      </div>
      {status === 'ended' ? (
        <p className={styles.periodNote}>Каталог завершён. Сроки участия и получения указаны отдельно в каждой акции.</p>
      ) : status === 'upcoming' ? (
        <p className={styles.periodNote}>Каталог начнётся {formatCatalogDate(catalog.startDate)}.</p>
      ) : null}

      {catalog.offers.map((offer, index) => <Offer key={offer.id} offer={offer} onOpen={openSlide} now={now} priority={index === 0} />)}
      {catalog.offers.length === 0 ? <p className={styles.periodNote}>Проверенные акции этого каталога пока не добавлены.</p> : null}

      <section className={styles.source} aria-labelledby="catalog-documents-title">
        <div className={styles.sectionHeading}>
          <h2 id="catalog-documents-title">Официальные документы</h2>
        </div>
        {catalog.documents.map((document) => (
          <div className={styles.rulesRow} key={document.id}>
            <div>
              <h3>{document.title}</h3>
              {document.description ? <p>{document.description}</p> : null}
            </div>
            <a href={catalogAssetUrl(document.href)} target="_blank" rel="noopener noreferrer" className={styles.rulesLink}>
              Открыть PDF <IconArrowUpRight />
            </a>
          </div>
        ))}
      </section>

      <dialog
        ref={dialogRef}
        className={styles.imageDialog}
        aria-labelledby="campaign-slide-title"
        onCancel={() => setActiveSlide(null)}
        onClose={() => { setActiveSlide(null); setZoomed(false); }}
        onClick={(event) => { if (event.target === event.currentTarget) setActiveSlide(null); }}
      >
        <div className={styles.dialogHeader}>
          <div aria-live="polite">
            <p>Слайд {activeSlide?.number} · {activeIndex + 1} / {allSlides.length}</p>
            <h2 id="campaign-slide-title">{activeSlide?.title}</h2>
          </div>
          <button type="button" onClick={() => setActiveSlide(null)} className={styles.closeButton} aria-label="Закрыть увеличенный слайд">✕</button>
        </div>
        <div ref={imageViewportRef} className={`${styles.imageViewport} ${zoomed ? styles.zoomed : ''}`} tabIndex={0} aria-label="Изображение слайда. В увеличенном виде доступна прокрутка.">
          {activeSlide ? <img src={catalogAssetUrl(activeSlide.src)} alt={activeSlide.alt} width={activeSlide.width} height={activeSlide.height} style={zoomed ? { width: activeSlide.width, minWidth: activeSlide.width } : undefined} /> : null}
        </div>
        <div className={styles.dialogControls}>
          <button type="button" disabled={activeIndex <= 0} onClick={() => openSlide(allSlides[activeIndex - 1])} aria-label="Предыдущий слайд">←</button>
          <button type="button" onClick={() => { setZoomed((value) => !value); imageViewportRef.current?.scrollTo(0, 0); }} aria-pressed={zoomed}>
            {zoomed ? 'Вписать в экран' : 'Увеличить текст'}
          </button>
          <button type="button" disabled={activeIndex >= allSlides.length - 1} onClick={() => openSlide(allSlides[activeIndex + 1])} aria-label="Следующий слайд">→</button>
        </div>
      </dialog>
    </div>
  );
}
