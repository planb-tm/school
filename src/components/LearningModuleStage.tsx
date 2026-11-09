import type { ReactNode } from 'react';
import type { FirstOrderStage } from '@/data/learning/firstOrder';
import { firstOrderStageAnchor } from '@/data/learning/firstOrder';

type Props = {
  stage: FirstOrderStage;
  children?: ReactNode;
  hideHeading?: boolean;
};

export function LearningModuleStage({ stage, children, hideHeading = false }: Props) {
  if (stage.status === 'hidden') return null;

  return (
    <section
      id={firstOrderStageAnchor(stage.id)}
      className="panel"
      aria-labelledby={`${stage.id}-title`}
    >
      {!hideHeading ? (
        <header className="panel__header">
          <h2 id={`${stage.id}-title`}>{stage.title}</h2>
          {stage.description ? <p>{stage.description}</p> : null}
        </header>
      ) : null}
      {stage.status === 'draft' && stage.placeholder ? (
        <div className="callout callout--info" role="note">
          <p>{stage.placeholder}</p>
        </div>
      ) : null}
      {children}
    </section>
  );
}
