import { useEffect, useRef, useState } from 'react';
import type { OrderStepSequence } from '@/data/learning/orders';
import {
  ORDER_SCREENSHOT_HEIGHT,
  ORDER_SCREENSHOT_WIDTH,
} from '@/data/learning/orders';
import {
  loadSequenceProgress,
  saveSequenceProgress,
} from '@/lib/progress';
import styles from './LearningStepSequence.module.css';

type WizardState = 'active' | 'resume' | 'completed';

export function LearningStepSequence({
  sequence,
}: {
  sequence: OrderStepSequence;
}) {
  const savedProgress = loadSequenceProgress(
    'first-order',
    sequence.id,
    sequence.steps.length,
  );
  const [activeIndex, setActiveIndex] = useState(
    () => savedProgress?.stepIndex ?? 0,
  );
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    if (!savedProgress) return 'active';
    return savedProgress.completed ? 'completed' : 'resume';
  });
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageDialogRef = useRef<HTMLDialogElement>(null);
  const imageViewportRef = useRef<HTMLDivElement>(null);
  const step = sequence.steps[activeIndex];
  const stepTitleId = `sequence-${sequence.id}-step-title`;
  const imageDialogTitleId = `sequence-${sequence.id}-image-title`;
  const imageAvailable = failedImageSrc !== step.imageSrc;
  const isFirstStep = activeIndex === 0;
  const isLastStep = activeIndex === sequence.steps.length - 1;

  useEffect(() => {
    const dialog = imageDialogRef.current;
    if (!dialog) return;

    if (!isImageOpen) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isImageOpen]);

  function saveStep(index: number, completed = false) {
    saveSequenceProgress('first-order', sequence.id, {
      stepIndex: index,
      completed,
    });
  }

  function openStep(index: number, allowFuture = false) {
    if (index < 0 || index >= sequence.steps.length) return;
    if (!allowFuture && index > activeIndex) return;
    setActiveIndex(index);
    setFailedImageSrc(null);
    setIsZoomed(false);
    imageViewportRef.current?.scrollTo(0, 0);
    saveStep(index);
  }

  function startFromBeginning() {
    setActiveIndex(0);
    setWizardState('active');
    setFailedImageSrc(null);
    saveStep(0);
  }

  function finishInstruction() {
    saveStep(activeIndex, true);
    setWizardState('completed');
  }

  function openImage() {
    setIsZoomed(false);
    imageViewportRef.current?.scrollTo(0, 0);
    setIsImageOpen(true);
  }

  function toggleImageZoom() {
    setIsZoomed((current) => !current);
    imageViewportRef.current?.scrollTo(0, 0);
  }

  if (wizardState === 'resume') {
    return (
      <section className={styles.sequence} aria-labelledby={`${sequence.id}-resume-title`}>
        <div className={styles.resumePanel}>
          <p className={styles.eyebrow}>Сохранённый прогресс</p>
          <h2 id={`${sequence.id}-resume-title`}>Продолжить инструкцию?</h2>
          <p>Ты остановился на шаге {activeIndex + 1} из {sequence.steps.length}: {step.title}</p>
          <div className={styles.resumeActions}>
            <button type="button" className="btn btn--primary" onClick={() => setWizardState('active')}>
              Продолжить
            </button>
            <button type="button" className="btn btn--secondary" onClick={startFromBeginning}>
              Начать сначала
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (wizardState === 'completed') {
    return (
      <section className={styles.sequence} aria-labelledby={`${sequence.id}-completed-title`}>
        <div className={styles.resumePanel}>
          <p className={styles.eyebrow}>Готово</p>
          <h2 id={`${sequence.id}-completed-title`}>Инструкция завершена</h2>
          <p>Перед отправкой заказа дождись подтверждения на официальном сайте Oriflame.</p>
          <div className={styles.resumeActions}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setWizardState('active')}
            >
              Открыть последний шаг
            </button>
            <button type="button" className="btn btn--secondary" onClick={startFromBeginning}>
              Пройти заново
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.sequence} aria-label={sequence.title}>
      <header className={styles.sequenceHeader}>
        <div className={styles.progressSummary}>
          <span className={styles.stepCount}>Шаг {step.number} из {sequence.steps.length}</span>
          <span className={styles.stageLabel}>Этап {step.stageNumber}. {step.stageTitle}</span>
        </div>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-label="Прогресс инструкции"
          aria-valuemin={1}
          aria-valuemax={sequence.steps.length}
          aria-valuenow={step.number}
        >
          <span style={{ width: `${(step.number / sequence.steps.length) * 100}%` }} />
        </div>
        <nav className={styles.stepJump} aria-label="Перейти к пройденному шагу">
          <ol>
            {sequence.steps.map((item, index) => {
              const isCurrent = index === activeIndex;
              const isComplete = index < activeIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={[
                      styles.stepJumpButton,
                      isCurrent ? styles.stepJumpButtonCurrent : '',
                      isComplete ? styles.stepJumpButtonComplete : '',
                    ].filter(Boolean).join(' ')}
                    aria-label={`Шаг ${item.number}: ${item.title}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    title={item.title}
                    disabled={index > activeIndex}
                    onClick={() => openStep(index)}
                  >
                    {String(item.number).padStart(2, '0')}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <div className={styles.wizardLayout}>
        <div className={styles.stepDetails} aria-live="polite">
          <h2 id={stepTitleId}>{step.title}</h2>
          <p>{step.description}</p>
        </div>

        <figure className={styles.imageFigure}>
          <div className={styles.imageFrame}>
            {imageAvailable ? (
              <button
                type="button"
                className={styles.imageButton}
                aria-label={`Открыть скриншот крупнее: шаг ${step.number}, ${step.title}`}
                aria-haspopup="dialog"
                aria-describedby={stepTitleId}
                onClick={openImage}
              >
                <img
                  className={styles.screenshot}
                  src={step.imageSrc}
                  alt={step.imageAlt}
                  width={ORDER_SCREENSHOT_WIDTH}
                  height={ORDER_SCREENSHOT_HEIGHT}
                  onError={() => setFailedImageSrc(step.imageSrc)}
                />
              </button>
            ) : (
              <div className={styles.imageUnavailable} role="status">
                Не удалось загрузить изображение. Проверьте подключение и попробуйте обновить страницу.
              </div>
            )}
          </div>
          <figcaption className={styles.imageHint}>Нажми на изображение, чтобы увеличить</figcaption>
        </figure>

        <nav className={styles.controls} aria-label={`Переходы по шагам: ${sequence.title}`}>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={isFirstStep}
            aria-label="Предыдущий шаг"
            onClick={() => openStep(activeIndex - 1, true)}
          >
            Назад
          </button>
          {isLastStep ? (
            <button type="button" className="btn btn--primary" onClick={finishInstruction}>
              Завершить инструкцию
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              aria-describedby={stepTitleId}
              onClick={() => openStep(activeIndex + 1, true)}
            >
              Далее
            </button>
          )}
        </nav>
      </div>

      {imageAvailable ? (
        <dialog
          ref={imageDialogRef}
          className={styles.imageDialog}
          aria-labelledby={imageDialogTitleId}
          onCancel={() => setIsImageOpen(false)}
          onClose={() => { setIsImageOpen(false); setIsZoomed(false); }}
          onClick={(event) => {
            if (event.target === imageDialogRef.current) setIsImageOpen(false);
          }}
        >
          <div className={styles.dialogHeader}>
            <div>
              <p>{step.stageTitle} · шаг {step.number} из {sequence.steps.length}</p>
              <h2 id={imageDialogTitleId}>{step.title}</h2>
            </div>
            <button
              type="button"
              className="btn btn--secondary"
              aria-label="Закрыть увеличенное изображение"
              onClick={() => setIsImageOpen(false)}
            >
              Закрыть
            </button>
          </div>
          <div
            ref={imageViewportRef}
            className={styles.imageViewport}
            tabIndex={0}
            aria-label="Полноразмерное изображение. Увеличенный скриншот можно перемещать прокруткой."
          >
            <img
              className={`${styles.largeScreenshot} ${isZoomed ? styles.largeScreenshotZoomed : ''}`}
              src={step.imageSrc}
              alt={step.imageAlt}
              width={ORDER_SCREENSHOT_WIDTH}
              height={ORDER_SCREENSHOT_HEIGHT}
              style={isZoomed ? {
                width: `${ORDER_SCREENSHOT_WIDTH}px`,
                minWidth: `${ORDER_SCREENSHOT_WIDTH}px`,
              } : undefined}
            />
          </div>
          <div className={styles.dialogControls}>
            <button
              type="button"
              className="btn btn--secondary"
              disabled={isFirstStep}
              aria-label="Предыдущее изображение"
              onClick={() => openStep(activeIndex - 1, true)}
            >
              Назад
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              aria-pressed={isZoomed}
              onClick={toggleImageZoom}
            >
              {isZoomed ? 'Вписать в экран' : 'Увеличить текст'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              disabled={isLastStep}
              aria-label="Следующее изображение"
              onClick={() => openStep(activeIndex + 1, true)}
            >
              Далее
            </button>
          </div>
        </dialog>
      ) : null}
    </section>
  );
}
