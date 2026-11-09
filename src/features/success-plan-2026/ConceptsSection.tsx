import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { knowledgeCards } from '@/data/success-plan-2026/knowledgeCards';
import { getSourceById } from '@/data/success-plan-2026/sources';
import type { KnowledgeCategory, KnowledgeCard } from '@/types/learning';
import styles from './SuccessPlan.module.css';

const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  basics: 'Основы',
  recommendation_bonus: 'Рек. бонус',
  team_bonus: 'Командный',
  qualification: 'Квалификация',
  levels: 'Уровни',
  volume: 'Объём продаж',
  other: 'Прочее',
};

/** Suggested order for a first-time learner. */
const LEARNING_ORDER = [
  'plan-success',
  'bb-points',
  'sales-volume',
  'personal-group',
  'first-level',
  'qualification-150',
  'recommendation-bonus',
  'team-bonus',
  'levels-table',
  'max-of-two',
  'calculation-limits',
];

function sortForLearning(cards: KnowledgeCard[]): KnowledgeCard[] {
  return [...cards].sort((a, b) => {
    const ai = LEARNING_ORDER.indexOf(a.id);
    const bi = LEARNING_ORDER.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

function SourceLine({ card }: { card: KnowledgeCard }) {
  const pages = card.sources.flatMap((s) => s.pages ?? []);
  const primary = getSourceById(card.sources[0]?.sourceId ?? '');
  return (
    <div className="source-meta">
      <StatusBadge status={card.status} compact />
      <p className="source-line">
        {primary ? primary.title : 'Источник'}
        {pages.length > 0 ? ` · с. ${pages.join(', ')}` : null}
      </p>
    </div>
  );
}

export function ConceptsSection() {
  const ordered = useMemo(() => sortForLearning(knowledgeCards), []);
  const [openId, setOpenId] = useState<string | null>(ordered[0]?.id ?? null);
  const [filter, setFilter] = useState<KnowledgeCategory | 'all'>('all');

  const usedCategories = useMemo(() => {
    const set = new Set(knowledgeCards.map((c) => c.category));
    return (Object.keys(CATEGORY_LABELS) as KnowledgeCategory[]).filter((k) =>
      set.has(k),
    );
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return ordered;
    return ordered.filter((card) => card.category === filter);
  }, [filter, ordered]);

  if (knowledgeCards.length === 0) {
    return (
      <EmptyState
        title="Карточки пока пусты"
        message="Добавьте знания в data/success-plan-2026/knowledgeCards.ts"
      />
    );
  }

  return (
    <section className="panel" id="concepts" aria-label="Основные понятия">
      <div className="filter-row" role="group" aria-label="Фильтр категорий">
        <button
          type="button"
          className={filter === 'all' ? 'chip chip--active' : 'chip'}
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        {usedCategories.map((key) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'chip chip--active' : 'chip'}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {CATEGORY_LABELS[key]}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status">Показано карточек: {filtered.length}.</p>

      {filtered.length === 0 ? (
        <EmptyState title="Нет карточек" message="В этой категории пока нет материалов." />
      ) : (
        <div className="card-list">
          {filtered.map((card, index) => {
            const open = openId === card.id;
            const limitations = [
              ...(card.exceptions ?? []),
              ...(card.commonMistakes ?? []).map((m) => `Типичная ошибка: ${m}`),
            ];

            return (
              <article key={card.id} className="knowledge-card">
                <h2 className={styles.accordionHeading}>
                  <button
                    id={`concept-${card.id}-toggle`}
                    type="button"
                    className="knowledge-card__toggle"
                    aria-expanded={open}
                    aria-controls={`concept-${card.id}-body`}
                    onClick={() => setOpenId(open ? null : card.id)}
                  >
                    <span className="knowledge-card__heading">
                      <span className="knowledge-card__eyebrow">
                        {index + 1}. {CATEGORY_LABELS[card.category]}
                      </span>
                      <span className="knowledge-card__title">{card.title}</span>
                    </span>
                    <StatusBadge status={card.status} compact />
                  </button>
                </h2>

                <div
                  id={`concept-${card.id}-body`}
                  className={`knowledge-card__body ${styles.collapsible}`}
                  role="region"
                  aria-labelledby={`concept-${card.id}-toggle`}
                  hidden={!open}
                >
                  <div className="text-block">
                    <h3>1. Простыми словами</h3>
                    <p>{card.plainExplanation}</p>
                  </div>

                  {card.officialWording ? (
                    <div className="text-block text-block--official">
                      <h3>2. Официальное правило</h3>
                      <p>{card.officialWording}</p>
                    </div>
                  ) : (
                    <div className="text-block text-block--official">
                      <h3>2. Официальное правило</h3>
                      <p className="muted">
                        Точная формулировка ещё не вынесена - смотрите статус
                        сверки и исходный PDF.
                      </p>
                    </div>
                  )}

                  {card.conditions && card.conditions.length > 0 ? (
                    <div className="text-block">
                      <h3>Условия</h3>
                      <ul>
                        {card.conditions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="text-block">
                    <h3>3. Пример</h3>
                    {card.examples && card.examples.length > 0 ? (
                      <ul>
                        {card.examples.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="muted">
                        Отдельный числовой пример - в разделе «Разбор примеров».
                      </p>
                    )}
                  </div>

                  <div className="text-block text-block--limits">
                    <h3>4. Ограничения и осторожности</h3>
                    {limitations.length > 0 ? (
                      <ul>
                        {limitations.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="muted">
                        Для этой карточки отдельных исключений в данных нет.
                        Общие границы модели - в карточке «Ограничения учебной
                        модели».
                      </p>
                    )}
                  </div>

                  <div className="text-block">
                    <h3>5. Источник</h3>
                    <SourceLine card={card} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

    </section>
  );
}
