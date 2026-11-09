import { useEffect, useRef, useState } from 'react';
import type { OrderStepSequence } from '@/data/learning/orders';
import styles from './LearningStepSequence.module.css';

export function LearningStepSequence({
  sequence,
  presentation = 'standard',
}: {
  sequence: OrderStepSequence;
  presentation?: 'standard' | 'screenshots-only';
}) {
  const screenshotsOnly = presentation === 'screenshots-only';
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const imageDialogRef = useRef<HTMLDialogElement>(null);
  const step = sequence.steps[activeIndex];
  const sequenceTitleId = `sequence-${sequence.id}-title`;
  const stepTitleId = `sequence-${sequence.id}-step-title`;
  const imageDialogTitleId = `sequence-${sequence.id}-image-title`;
  const imageAvailable = Boolean(
    step.imageSrc && failedImageSrc !== step.imageSrc,
  );

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

  return (
    <section
      className={`panel ${styles.sequence} ${screenshotsOnly ? styles.screenshotsOnly : ''}`}
      aria-label={screenshotsOnly ? 'Скриншоты оформления заказа' : undefined}
      aria-labelledby={screenshotsOnly ? undefined : sequenceTitleId}
    >
      {!screenshotsOnly ? (
        <header className={styles.sequenceHeader}>
          <p className="eyebrow">Пошаговая инструкция</p>
          <h2 id={sequenceTitleId}>{sequence.title}</h2>
          {sequence.description ? <p>{sequence.description}</p> : null}
        </header>
      ) : null}

      <div className={`${styles.stepLayout} ${screenshotsOnly ? styles.screenshotsOnlyLayout : ''}`}>
        <div className={styles.mediaColumn}>
          <div className={screenshotsOnly ? styles.screenshotPhoneFrame : styles.phoneFrame}>
            {imageAvailable ? (
              <>
                <button
                  type="button"
                  className={styles.imageButton}
                  aria-label={`Открыть скриншот крупнее: ${step.imageCaption}`}
                  aria-haspopup="dialog"
                  onClick={() => setIsImageOpen(true)}
                >
                  <img
                    className={styles.screenshot}
                    src={step.imageSrc ?? undefined}
                    alt={step.imageAlt}
                    onError={() => {
                      setFailedImageSrc(step.imageSrc);
                      setIsImageOpen(false);
                    }}
                  />
                  {step.highlight ? (
                    <span
                      className={styles.highlight}
                      aria-hidden="true"
                      style={{
                        left: `${step.highlight.x}%`,
                        top: `${step.highlight.y}%`,
                        width: `${step.highlight.width}%`,
                        height: `${step.highlight.height}%`,
                      }}
                    />
                  ) : null}
                </button>
              </>
            ) : (
              <div
                className={styles.placeholder}
                role="img"
                aria-label={step.imageAlt}
              >
                <strong>Скриншот пока не добавлен</strong>
                <span>Здесь будет проверенное изображение экрана.</span>
              </div>
            )}
          </div>
          <p className={styles.imageCaption}>{step.imageCaption}</p>
          {imageAvailable && !screenshotsOnly ? (
            <p className={styles.zoomHint}>Нажмите на скриншот, чтобы увеличить</p>
          ) : null}
        </div>

        {!screenshotsOnly ? (
          <div className={styles.stepContent}>
            <p className={styles.stepCount} aria-live="polite">
              Шаг {activeIndex + 1} из {sequence.steps.length}
            </p>
            <h3 id={stepTitleId}>{step.title}</h3>
            {step.description ? <p>{step.description}</p> : null}
          </div>
        ) : null}
      </div>

      <nav
        className={styles.controls}
        aria-label={screenshotsOnly ? 'Переход по скриншотам' : `Шаги: ${sequence.title}`}
      >
        <button
          type="button"
          className="btn btn--secondary"
          disabled={activeIndex === 0}
          aria-label={screenshotsOnly ? 'Предыдущий скриншот' : `Назад: ${step.title}`}
          onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
        >
          Назад
        </button>
        <span className={styles.controlStep} aria-live="polite" aria-atomic="true">
          {activeIndex + 1} / {sequence.steps.length}
        </span>
        <button
          type="button"
          className="btn btn--primary"
          disabled={activeIndex === sequence.steps.length - 1}
          aria-label={screenshotsOnly
            ? 'Следующий скриншот'
            : `Далее: ${sequence.steps[activeIndex + 1]?.title ?? 'последний шаг'}`}
          aria-describedby={screenshotsOnly ? undefined : stepTitleId}
          onClick={() =>
            setActiveIndex((current) =>
              Math.min(sequence.steps.length - 1, current + 1),
            )
          }
        >
          Далее
        </button>
      </nav>

      {imageAvailable ? (
        <dialog
          ref={imageDialogRef}
          className={styles.imageDialog}
          aria-labelledby={imageDialogTitleId}
          aria-describedby={`${imageDialogTitleId}-caption`}
          onCancel={() => setIsImageOpen(false)}
          onClose={() => setIsImageOpen(false)}
          onClick={(event) => {
            if (event.target === imageDialogRef.current) {
              setIsImageOpen(false);
            }
          }}
        >
          <div className={styles.dialogHeader}>
            <h2 id={imageDialogTitleId}>{step.title}</h2>
            <button
              type="button"
              className="btn btn--secondary"
              aria-label="Закрыть увеличенное изображение"
              onClick={() => setIsImageOpen(false)}
            >
              Закрыть
            </button>
          </div>
          <figure className={styles.largeFigure}>
            <img
              className={styles.largeScreenshot}
              src={step.imageSrc ?? undefined}
              alt={step.imageAlt}
            />
            <figcaption id={`${imageDialogTitleId}-caption`}>
              {step.imageCaption}
            </figcaption>
          </figure>
        </dialog>
      ) : null}
    </section>
  );
}
