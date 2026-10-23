import { Link } from 'react-router-dom';
import {
  productCategories,
  productsIntro,
  productsLessonMeta,
  productsOutro,
} from '@/data/learning/products';

export function ProductsPage() {
  return (
    <div className="tools-page">
      <Link to="/learn" className="tools-back">
        ← К обучению
      </Link>

      <header className="home-intro">
        <p className="eyebrow">Материал</p>
        <h1 className="home-intro__title">{productsLessonMeta.title}</h1>
        <div className="lesson-intro">
          {productsIntro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </header>

      <section className="panel" aria-label="Категории продукции">
        <ul className="info-list">
          {productCategories.map((category) => (
            <li key={category.id} className="info-list__item">
              <h2 className="info-list__title">{category.title}</h2>
              <p className="info-list__desc">{category.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel panel--soft" aria-label="Где смотреть подробнее">
        <p className="info-list__desc">{productsOutro.text}</p>
        <ul className="external-links">
          {productsOutro.links.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="external-links__item"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
