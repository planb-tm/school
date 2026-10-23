import { successPlanData } from '@/data/success-plan-2026/module';

export function OverviewSection() {
  const { overview } = successPlanData;

  return (
    <section className="panel" id="overview">
      <header className="panel__header">
        <h2>Введение</h2>
        <p>Что такое План Успеха и зачем сначала освоить основы</p>
      </header>

      <div className="stack">
        <div className="callout callout--info">
          <strong>Роль Плана Успеха</strong>
          <p>{overview.rolePlain}</p>
          <p className="muted">
            <em>Официальная формулировка из словаря документа (с.&nbsp;{overview.roleOfficialPage}):</em>{' '}
            {overview.roleOfficial}
          </p>
        </div>

        <div className="callout">
          <strong>Что описывает маркетинг-план</strong>
          <ul className="plain-list">
            {overview.marketingPlanCovers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{overview.whyTermsFirst}</p>
        </div>

        <div className="callout callout--info">
          <strong>Что ты узнаешь</strong>
          <ul className="plain-list">
            {overview.learningGoals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <div className="callout">
          <strong>После модуля ты сможешь</strong>
          <ul className="plain-list">
            {overview.afterModule.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="callout callout--warn">
          <strong>Важно про доход</strong>
          <p>{overview.incomeDisclaimer}</p>
        </div>

        <div className="callout">
          <strong>Ограничения учебной модели</strong>
          <ul className="plain-list">
            {overview.modelLimits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
