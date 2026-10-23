import { Link } from 'react-router-dom';

export interface LearningPathStep {
  id: string;
  label: string;
  hint: string;
  to: string;
}

export function LearningPath({ steps }: { steps: LearningPathStep[] }) {
  return (
    <ol className="learning-path" aria-label="Путь обучения">
      {steps.map((step, index) => (
        <li key={step.id}>
          <Link to={step.to} className="learning-path__step">
            <span className="learning-path__num" aria-hidden="true">
              {index + 1}
            </span>
            <span className="learning-path__text">
              <span className="learning-path__label">{step.label}</span>
              <span className="learning-path__hint">{step.hint}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
