import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { calculationExamples } from '@/data/success-plan-2026/examples';
import {
  calculateSuccessPlanScenario,
  example1Input,
  example2Input,
} from '@/lib/successPlanCalculations';
import { buildScenarioExplanation } from '@/lib/scenarioExplanation';
import { formatRub } from '@/lib/format';
import type { CalculationExample } from '@/types/learning';

function inputForExample(example: CalculationExample) {
  if (example.id === 'example-1') return example1Input();
  if (example.id === 'example-2') return example2Input();
  return example1Input();
}

function ExampleWalkthrough({ example }: { example: CalculationExample }) {
  const input = useMemo(() => inputForExample(example), [example]);
  const result = useMemo(() => calculateSuccessPlanScenario(input), [input]);
  const steps = useMemo(
    () => buildScenarioExplanation(input, result),
    [input, result],
  );
  const [visibleCount, setVisibleCount] = useState(1);

  const shown = steps.slice(0, visibleCount);
  const done = visibleCount >= steps.length;

  return (
    <article className="example-card">
      <div className="example-card__top">
        <h3>{example.title}</h3>
        <StatusBadge status={example.status} compact />
      </div>
      <p>{example.description}</p>

      <div className="walkthrough">
        <p className="muted walkthrough__progress">
          Шаг {Math.min(visibleCount, steps.length)} из {steps.length}
        </p>

        <ol className="walkthrough__steps">
          {shown.map((step, index) => (
            <li key={step.id} className="walkthrough__step">
              <div className="walkthrough__step-head">
                <span className="walkthrough__num">{index + 1}</span>
                <strong>{step.title}</strong>
              </div>
              <p>{step.detail}</p>
              {step.formula ? (
                <p className="walkthrough__formula">
                  <span className="muted">Вычисление:</span> {step.formula}
                </p>
              ) : null}
              {step.valueLabel ? (
                <p className="walkthrough__value">{step.valueLabel}</p>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="walkthrough__actions">
          {!done ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setVisibleCount((n) => Math.min(n + 1, steps.length))}
            >
              Показать следующий шаг
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setVisibleCount(1)}
            >
              Пройти пример заново
            </button>
          )}
          {!done && visibleCount > 1 ? (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setVisibleCount(steps.length)}
            >
              Показать все шаги
            </button>
          ) : null}
        </div>
      </div>

      {done ? (
        <div className="result-grid">
          <div>
            <span className="muted">Рекомендационный</span>
            <strong>{formatRub(example.expected.recommendationBonus)}</strong>
          </div>
          <div>
            <span className="muted">Командный (с группы)</span>
            <strong>{formatRub(example.expected.teamBonus)}</strong>
          </div>
          <div className="result-grid__highlight">
            <span className="muted">Итог в документе</span>
            <strong>{formatRub(example.expected.selectedAmount)}</strong>
            <span className="muted">
              {example.expected.selectedBonus === 'recommendation'
                ? 'Выбран рекомендационный'
                : 'Выбран командный'}
            </span>
          </div>
        </div>
      ) : null}

      <p className="disclaimer">{example.disclaimer}</p>
      <p className="source-line">
        Источник: с. {example.sources.flatMap((s) => s.pages ?? []).join(', ')}
      </p>
    </article>
  );
}

export function ExamplesSection() {
  return (
    <section className="panel" id="examples">
      <header className="panel__header">
        <h2>Разбор контрольных примеров</h2>
        <p>
          Два контрольных примера из «Плана Успеха» 2026. Открывайте шаги по одному -
          так проще увидеть промежуточные суммы.
        </p>
      </header>

      <div className="stack">
        {calculationExamples.map((example) => (
          <ExampleWalkthrough key={example.id} example={example} />
        ))}
      </div>

    </section>
  );
}
