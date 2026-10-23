import { useMemo, useState } from 'react';
import {
  tryCalculateSuccessPlanScenario,
  type SuccessPlanScenarioInput,
} from '@/lib/successPlanCalculations';
import {
  MODEL_LIMITATIONS,
  buildScenarioExplanation,
} from '@/lib/scenarioExplanation';
import { parseNonNegativeNumber, parsePositiveInteger } from '@/lib/inputValidation';
import { formatBb, formatPercent, formatRub } from '@/lib/format';
import {
  markTaskComplete,
  saveScenarioResult,
  type LearningProgress,
} from '@/lib/progress';

type PresetId = 'example1' | 'example2' | 'custom';

interface FormState {
  personalBb: string;
  partnerCount: string;
  partnerBb: string;
  deeperBb: string;
}

const PRESETS: Record<Exclude<PresetId, 'custom'>, FormState> = {
  example1: {
    personalBb: '150',
    partnerCount: '5',
    partnerBb: '100',
    deeperBb: '0',
  },
  example2: {
    personalBb: '150',
    partnerCount: '5',
    partnerBb: '100',
    deeperBb: '500',
  },
};

function buildInput(form: FormState): {
  input: SuccessPlanScenarioInput | null;
  error: string | null;
} {
  const personal = parseNonNegativeNumber(form.personalBb, 'Личные ББ');
  if (!personal.ok) return { input: null, error: personal.error };

  const count = parsePositiveInteger(form.partnerCount, 'Число партнёров', {
    min: 1,
    max: 10,
  });
  if (!count.ok) return { input: null, error: count.error };

  const partnerBb = parseNonNegativeNumber(
    form.partnerBb,
    'ББ заказа партнёра 1-го уровня',
  );
  if (!partnerBb.ok) return { input: null, error: partnerBb.error };

  const deeper = parseNonNegativeNumber(form.deeperBb, 'Доп. ББ глубже в ветви');
  if (!deeper.ok) return { input: null, error: deeper.error };

  const branchBb = partnerBb.value + deeper.value;
  const input: SuccessPlanScenarioInput = {
    personalBb: personal.value,
    branches: Array.from({ length: count.value }, () => ({
      branchBb,
      firstLevelPartnerBb: partnerBb.value,
    })),
  };

  return { input, error: null };
}

export function TryYourselfSection({
  progress,
  onProgressChange,
}: {
  progress: LearningProgress;
  onProgressChange: (next: LearningProgress) => void;
}) {
  const [preset, setPreset] = useState<PresetId>('example1');
  const [form, setForm] = useState<FormState>(PRESETS.example1);
  const [showSteps, setShowSteps] = useState(true);

  const parsed = useMemo(() => buildInput(form), [form]);

  const computed = useMemo(() => {
    if (!parsed.input) {
      return { result: null, error: parsed.error };
    }
    const outcome = tryCalculateSuccessPlanScenario(parsed.input);
    if (!outcome.ok) {
      return { result: null, error: outcome.error };
    }
    return { result: outcome.result, error: null as string | null };
  }, [parsed]);

  const explanation = useMemo(() => {
    if (!parsed.input || !computed.result) return [];
    return buildScenarioExplanation(parsed.input, computed.result);
  }, [parsed.input, computed.result]);

  function applyPreset(id: Exclude<PresetId, 'custom'>) {
    setPreset(id);
    setForm(PRESETS[id]);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setPreset('custom');
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function markDone() {
    if (!computed.result) return;
    let next = markTaskComplete(progress, 'try-yourself');
    next = saveScenarioResult(next, preset, true);
    onProgressChange(next);
  }

  const done = progress.completedTaskIds.includes('try-yourself');
  const branchBbPreview =
    parsed.input?.branches[0]?.branchBb ??
    Number(form.partnerBb || 0) + Number(form.deeperBb || 0);

  return (
    <section className="panel" id="try">
      <header className="panel__header">
        <h2>Самостоятельная практика</h2>
        <p>
          Меняйте входные значения. Ниже - учебный результат и разбор вычислений.
          Это не официальный расчёт кабинета.
        </p>
      </header>

      <div className="callout callout--warn">
        <strong>Границы применимости модели</strong>
        <ul className="plain-list">
          {MODEL_LIMITATIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="filter-row" role="group" aria-label="Готовые сценарии">
        <button
          type="button"
          className={preset === 'example1' ? 'chip chip--active' : 'chip'}
          onClick={() => applyPreset('example1')}
        >
          Пример 1
        </button>
        <button
          type="button"
          className={preset === 'example2' ? 'chip chip--active' : 'chip'}
          onClick={() => applyPreset('example2')}
        >
          Пример 2
        </button>
        <span className="chip-note">
          {preset === 'custom' ? 'Свои числа' : 'Поля можно менять'}
        </span>
      </div>

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          markDone();
        }}
      >
        <label>
          Личные ББ
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={form.personalBb}
            onChange={(e) => updateField('personalBb', e.target.value)}
          />
        </label>
        <label>
          Число партнёров 1-го уровня
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            inputMode="numeric"
            value={form.partnerCount}
            onChange={(e) => updateField('partnerCount', e.target.value)}
          />
        </label>
        <label>
          ББ заказа каждого партнёра 1-го уровня
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={form.partnerBb}
            onChange={(e) => updateField('partnerBb', e.target.value)}
          />
        </label>
        <label>
          Доп. ББ глубже в каждой ветви
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={form.deeperBb}
            onChange={(e) => updateField('deeperBb', e.target.value)}
          />
          <span className="field-hint">
            ББ одной ветви = заказ партнёра + глубже → сейчас{' '}
            {Number.isFinite(branchBbPreview) ? branchBbPreview : '-' } ББ
          </span>
        </label>

        <div className="form-grid__actions">
          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={!computed.result}
          >
            {done ? 'Прогресс сохранён' : 'Сохранить прогресс сценария'}
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--block"
            onClick={() => setShowSteps((v) => !v)}
          >
            {showSteps ? 'Скрыть объяснение' : 'Показать объяснение'}
          </button>
        </div>
      </form>

      {computed.error ? (
        <div className="error-state" role="alert">
          <h3>Нельзя посчитать</h3>
          <p>{computed.error}</p>
        </div>
      ) : null}

      {computed.result ? (
        <>
          <div className="result-grid result-grid--wide">
            <div>
              <span className="muted">Всего ББ</span>
              <strong>{formatBb(computed.result.totalBb)}</strong>
            </div>
            <div>
              <span className="muted">Ваш уровень</span>
              <strong>{formatPercent(computed.result.ownLevelPercent)}</strong>
            </div>
            <div>
              <span className="muted">Рекомендационный</span>
              <strong>{formatRub(computed.result.recommendationBonus)}</strong>
            </div>
            <div>
              <span className="muted">Командный с группы</span>
              <strong>{formatRub(computed.result.teamBonusFromGroupOrders)}</strong>
            </div>
            <div className="result-grid__highlight">
              <span className="muted">Учебный итог (большая сумма)</span>
              <strong>{formatRub(computed.result.selectedAmount)}</strong>
              <span className="muted">
                {computed.result.selectedBonus === 'recommendation'
                  ? 'Рекомендационный бонус'
                  : 'Командный бонус'}
              </span>
            </div>
          </div>

          {showSteps ? (
            <ol className="walkthrough__steps">
              {explanation.map((step, index) => (
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
                </li>
              ))}
            </ol>
          ) : null}
        </>
      ) : null}

      <p className="disclaimer">
        Результат учебный. Не выдавайте его за официальный расчёт Oriflame.
      </p>

    </section>
  );
}
