import { useState } from 'react';
import { learningQuestions } from '@/data/success-plan-2026/questions';
import { EmptyState } from '@/components/EmptyState';
import {
  clearQuizResults,
  markTaskComplete,
  saveQuizAnswer,
  type LearningProgress,
} from '@/lib/progress';

export function QuizSection({
  progress,
  onProgressChange,
}: {
  progress: LearningProgress;
  onProgressChange: (next: LearningProgress) => void;
}) {
  const [attemptKey, setAttemptKey] = useState(0);

  if (learningQuestions.length === 0) {
    return (
      <EmptyState
        title="Тест пуст"
        message="Добавьте вопросы в data/success-plan-2026/questions.ts"
      />
    );
  }

  const answeredCount = Object.keys(progress.quizResults).length;
  const correctCount = Object.values(progress.quizResults).filter((r) => r.correct)
    .length;
  const finished = answeredCount >= learningQuestions.length;

  function answer(questionId: string, selectedIndex: number, correctIndex: number) {
    const correct = selectedIndex === correctIndex;
    let next = saveQuizAnswer(progress, questionId, selectedIndex, correct);
    if (Object.keys(next.quizResults).length >= learningQuestions.length) {
      next = markTaskComplete(next, 'quiz');
    }
    onProgressChange(next);
  }

  function retake() {
    onProgressChange(clearQuizResults(progress));
    setAttemptKey((k) => k + 1);
  }

  return (
    <section className="panel" id="quiz">
      <header className="panel__header">
        <h2>Тест</h2>
        <p>
          После каждого ответа сразу видно, верно ли, и почему. Ответы хранятся
          только на этом устройстве.
          {answeredCount > 0
            ? ` Сейчас: ${correctCount} из ${answeredCount} верно.`
            : null}
        </p>
      </header>

      {finished ? (
        <div className="callout callout--info quiz-summary">
          <strong>
            Результат: {correctCount} из {learningQuestions.length}
          </strong>
          <p>
            Можно пройти тест ещё раз - прошлые ответы сбросятся, объяснения
            останутся доступны после новых ответов.
          </p>
          <button type="button" className="btn btn--secondary" onClick={retake}>
            Пройти тест заново
          </button>
        </div>
      ) : null}

      <div className="stack" key={attemptKey}>
        {learningQuestions.map((q, index) => {
          const saved = progress.quizResults[q.id];
          const answered = Boolean(saved);

          return (
            <article key={q.id} className="quiz-card">
              <h3>
                {index + 1}. {q.prompt}
              </h3>
              <div
                className="quiz-options"
                role="group"
                aria-label={`Вопрос ${index + 1}`}
              >
                {q.options.map((option, optionIndex) => {
                  const selected = saved?.selectedIndex === optionIndex;
                  const isCorrect = optionIndex === q.correctIndex;
                  let className = 'quiz-option';
                  if (answered && isCorrect) className += ' quiz-option--correct';
                  if (answered && selected && !isCorrect) {
                    className += ' quiz-option--wrong';
                  }
                  if (selected) className += ' quiz-option--selected';

                  return (
                    <button
                      key={option}
                      type="button"
                      className={className}
                      disabled={answered}
                      onClick={() => answer(q.id, optionIndex, q.correctIndex)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {answered && saved ? (
                <div
                  className={
                    saved.correct
                      ? 'callout callout--ok'
                      : 'callout callout--warn'
                  }
                  role="status"
                >
                  <strong>{saved.correct ? 'Верно' : 'Неверно'}</strong>
                  <p>{q.explanation}</p>
                  {!saved.correct ? (
                    <p>
                      Правильный ответ:{' '}
                      <strong>{q.options[q.correctIndex]}</strong>
                    </p>
                  ) : null}
                  <p className="source-line">
                    Источник: с.{' '}
                    {q.sources.flatMap((s) => s.pages ?? []).join(', ')}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {!finished && answeredCount > 0 ? (
        <div className="section-continue">
          <button type="button" className="btn btn--secondary" onClick={retake}>
            Сбросить ответы и начать заново
          </button>
        </div>
      ) : null}

    </section>
  );
}
