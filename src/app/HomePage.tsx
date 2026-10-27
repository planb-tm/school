import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-intro">
        <h1 className="home-intro__title">Рабочее пространство команды</h1>
        <p className="home-intro__lead">
          Здесь собраны материалы для обучения, ответы на рабочие вопросы и
          инструменты для работы в Oriflame.
        </p>
      </header>

      <Link to="/learn" className="home-hub-card">
        <p className="eyebrow eyebrow--accent">Обучение</p>
        <p className="home-hub-card__desc">
          Основы бизнеса, работа с заказами, продуктами и клиентами, приглашение
          новых партнёров.
        </p>
        <p className="home-hub-card__note">Для изучения и освоения</p>
      </Link>

      <Link to="/tools" className="home-hub-card">
        <p className="eyebrow eyebrow--accent">Инструменты</p>
        <p className="home-hub-card__desc">
          План Успеха, расчёты, визуализатор структуры команды и другие
          практические помощники.
        </p>
        <p className="home-hub-card__note">Для решения рабочих задач</p>
      </Link>
    </div>
  );
}
