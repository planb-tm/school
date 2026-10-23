import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CopyTextButton } from '@/components/CopyTextButton';
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer';
import {
  BUSINESS_ESSENCE_VIDEO_POSTER,
  BUSINESS_ESSENCE_VIDEO_URL,
  communicationRules,
  followupTemplates,
  invitationTemplates,
  invitationsIntro,
  invitingIntro,
  invitingLessonMeta,
  invitingSections,
  objectionCategories,
  objectionItems,
  type InvitingSectionId,
  type ObjectionCategoryId,
} from '@/data/learning/inviting';
import { matchesQuery } from '@/lib/invitingSearch';

export function InvitingPage() {
  const [section, setSection] = useState<InvitingSectionId>('invitations');
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<ObjectionCategoryId | 'all'>(
    'all',
  );

  const invitations = useMemo(
    () =>
      invitationTemplates.filter((item) =>
        matchesQuery(query, [
          item.title,
          item.text,
          item.whenToUse,
          ...item.keywords,
        ]),
      ),
    [query],
  );

  const objections = useMemo(
    () =>
      objectionItems.filter((item) => {
        if (categoryId !== 'all' && item.categoryId !== categoryId) return false;
        return matchesQuery(query, [
          item.title,
          item.answer,
          item.why,
          item.followUpQuestion,
          ...item.keywords,
        ]);
      }),
    [query, categoryId],
  );

  const followups = useMemo(
    () =>
      followupTemplates.filter((item) =>
        matchesQuery(query, [
          item.title,
          item.text,
          item.whenToUse,
          ...item.keywords,
        ]),
      ),
    [query],
  );

  const rules = useMemo(
    () =>
      communicationRules.filter((item) =>
        matchesQuery(query, [item.title, item.text, ...item.keywords]),
      ),
    [query],
  );

  const activeHint =
    invitingSections.find((item) => item.id === section)?.hint ?? '';

  return (
    <div className="tools-page">
      <Link to="/learn" className="tools-back">
        ← К обучению
      </Link>

      <header className="home-intro">
        <p className="eyebrow">Справочник</p>
        <h1 className="home-intro__title">{invitingLessonMeta.title}</h1>
        <p className="home-intro__lead">{invitingIntro}</p>
      </header>

      <nav className="ref-subnav" aria-label="Подразделы справочника">
        {invitingSections.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              section === item.id
                ? 'chip chip--active'
                : 'chip'
            }
            onClick={() => {
              setSection(item.id);
              setQuery('');
              setCategoryId('all');
            }}
          >
            {item.title}
          </button>
        ))}
      </nav>

      <p className="ref-subnav__hint">{activeHint}</p>

      <div className="ref-toolbar">
        <label className="ref-search">
          <span className="sr-only">Поиск по справочнику</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию или тексту"
            autoComplete="off"
          />
        </label>
      </div>

      {section === 'invitations' ? (
        <section className="stack" aria-label="Первые приглашения">
          <div className="panel panel--soft">
            <p className="info-list__desc">{invitationsIntro}</p>
            <div className="ref-video">
              <LessonVideoPlayer
                video={{
                  type: 'embed',
                  url: BUSINESS_ESSENCE_VIDEO_URL,
                  poster: BUSINESS_ESSENCE_VIDEO_POSTER,
                  title: 'Видео о сути бизнеса Oriflame',
                  duration: '~20 мин',
                  description:
                    'Видео Надежды Долиной о сути бизнеса Oriflame. Открой по кнопке воспроизведения или по ссылке ниже.',
                }}
              />
              <a
                className="external-links__item"
                href={BUSINESS_ESSENCE_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть видео на VK Video
              </a>
            </div>
            <p className="ref-note">
              Шаблоны ниже - альтернативы. Не отправляй их все одному человеку
              подряд.
            </p>
          </div>

          {invitations.length === 0 ? (
            <p className="muted">Ничего не найдено. Измени запрос поиска.</p>
          ) : (
            invitations.map((item) => (
              <article key={item.id} className="ref-card">
                <h2 className="ref-card__title">{item.title}</h2>
                <p className="ref-card__label">Когда использовать</p>
                <p className="ref-card__meta">{item.whenToUse}</p>
                <p className="ref-card__label">Текст</p>
                <pre className="ref-card__text">{item.text}</pre>
                <CopyTextButton text={item.text} label="Скопировать" />
              </article>
            ))
          )}
        </section>
      ) : null}

      {section === 'objections' ? (
        <section className="stack" aria-label="Ответы на возражения">
          <div className="filter-row" role="group" aria-label="Категории">
            <button
              type="button"
              className={categoryId === 'all' ? 'chip chip--active' : 'chip'}
              onClick={() => setCategoryId('all')}
            >
              Все
            </button>
            {objectionCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={
                  categoryId === category.id ? 'chip chip--active' : 'chip'
                }
                onClick={() => setCategoryId(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {objections.length === 0 ? (
            <p className="muted">Ничего не найдено. Измени фильтр или поиск.</p>
          ) : (
            objections.map((item) => {
              const categoryLabel =
                objectionCategories.find((c) => c.id === item.categoryId)
                  ?.label ?? '';
              return (
                <article key={item.id} className="ref-card">
                  <p className="eyebrow">{categoryLabel}</p>
                  <h2 className="ref-card__title">{item.title}</h2>
                  <p className="ref-card__label">Рекомендуемый ответ</p>
                  <pre className="ref-card__text">{item.answer}</pre>
                  <CopyTextButton text={item.answer} label="Скопировать ответ" />
                  <p className="ref-card__label">Почему так</p>
                  <p className="ref-card__meta">{item.why}</p>
                  {item.followUpQuestion ? (
                    <>
                      <p className="ref-card__label">Вопрос для продолжения</p>
                      <p className="ref-card__meta">{item.followUpQuestion}</p>
                    </>
                  ) : null}
                </article>
              );
            })
          )}
        </section>
      ) : null}

      {section === 'followups' ? (
        <section className="stack" aria-label="Готовые сообщения">
          {followups.length === 0 ? (
            <p className="muted">Ничего не найдено. Измени запрос поиска.</p>
          ) : (
            followups.map((item) => (
              <article key={item.id} className="ref-card">
                <h2 className="ref-card__title">{item.title}</h2>
                <p className="ref-card__label">Когда использовать</p>
                <p className="ref-card__meta">{item.whenToUse}</p>
                <p className="ref-card__label">Текст</p>
                <pre className="ref-card__text">{item.text}</pre>
                <CopyTextButton text={item.text} label="Скопировать" />
              </article>
            ))
          )}
        </section>
      ) : null}

      {section === 'rules' ? (
        <section className="stack" aria-label="Правила общения">
          {rules.length === 0 ? (
            <p className="muted">Ничего не найдено. Измени запрос поиска.</p>
          ) : (
            rules.map((item) => (
              <article key={item.id} className="ref-card">
                <h2 className="ref-card__title">{item.title}</h2>
                <p className="ref-card__meta">{item.text}</p>
              </article>
            ))
          )}
        </section>
      ) : null}
    </div>
  );
}
