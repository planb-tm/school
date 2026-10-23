import { StatusBadge, StatusLegend } from '@/components/StatusBadge';
import { sources } from '@/data/success-plan-2026/sources';
import { successPlanData } from '@/data/success-plan-2026/module';

export function SourcesSection() {
  return (
    <section className="panel" id="sources">
      <header className="panel__header">
        <h2>Источники и ограничения</h2>
        <p>
          Официальные PDF - в <code>docs/sources</code>. Статус показывает, что уже
          сверено для обучения, а что ещё нельзя считать полностью проверенным.
        </p>
      </header>

      <StatusLegend />

      <div className="stack">
        {sources.map((source) => (
          <article key={source.id} className="source-card">
            <div className="source-card__top">
              <h3>{source.title}</h3>
              <StatusBadge status={source.status} />
            </div>
            <dl className="meta-list">
              <div>
                <dt>Версия</dt>
                <dd>{source.version}</dd>
              </div>
              <div>
                <dt>Рынок</dt>
                <dd>{source.market}</dd>
              </div>
              {source.fileName ? (
                <div>
                  <dt>Файл</dt>
                  <dd>{source.fileName}</dd>
                </div>
              ) : null}
              {source.pages && source.pages.length > 0 ? (
                <div>
                  <dt>Страницы модуля</dt>
                  <dd>{source.pages.join(', ')}</dd>
                </div>
              ) : null}
            </dl>
            {source.notes ? <p className="muted">{source.notes}</p> : null}
          </article>
        ))}
      </div>

      <div className="callout">
        <strong>Что ещё нужно сверить</strong>
        <ul className="plain-list">
          {successPlanData.overview.reviewChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
