import { useEffect, useMemo, useState } from 'react';
import {
  applyPlaceholders,
  copyText,
  findPlaceholders,
} from '@/lib/copyText';

type Props = {
  text: string;
  label?: string;
};

/**
 * Copies text to clipboard. If placeholders remain, asks to fill them first.
 */
export function CopyTextButton({ text, label = 'Скопировать' }: Props) {
  const placeholders = useMemo(() => findPlaceholders(text), [text]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'ok' | 'blocked' | 'error'>(
    'idle',
  );

  useEffect(() => {
    if (status !== 'ok' && status !== 'error' && status !== 'blocked') return;
    const timer = window.setTimeout(() => setStatus('idle'), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  const composed = applyPlaceholders(text, values);
  const unresolved = findPlaceholders(composed);

  async function handleCopy() {
    if (unresolved.length > 0) {
      setStatus('blocked');
      return;
    }
    const ok = await copyText(composed);
    setStatus(ok ? 'ok' : 'error');
  }

  return (
    <div className="copy-block">
      {placeholders.length > 0 ? (
        <div className="copy-block__fields">
          <p className="copy-block__hint">
            Перед копированием замени поля в квадратных скобках:
          </p>
          {placeholders.map((token) => (
            <label key={token} className="copy-block__field">
              <span>{token}</span>
              <input
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="Вставь своё значение"
                value={values[token] ?? ''}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    [token]: event.target.value,
                  }))
                }
              />
            </label>
          ))}
        </div>
      ) : null}

      <button type="button" className="btn btn--secondary" onClick={handleCopy}>
        {label}
      </button>

      {status === 'ok' ? (
        <p className="copy-block__status copy-block__status--ok" role="status">
          Текст скопирован
        </p>
      ) : null}
      {status === 'blocked' ? (
        <p className="copy-block__status copy-block__status--warn" role="status">
          Сначала заполни поля в квадратных скобках
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="copy-block__status copy-block__status--warn" role="status">
          Не удалось скопировать. Скопируй текст вручную
        </p>
      ) : null}
    </div>
  );
}
