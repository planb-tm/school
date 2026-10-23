import { Link } from 'react-router-dom';
import {
  productCategories,
  productsIntro,
  productsLessonMeta,
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
    </div>
  );
}
