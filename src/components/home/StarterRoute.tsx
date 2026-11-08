import { Link } from 'react-router-dom';
import { starterRouteSteps } from '@/data/home/starterRoute';
import styles from '@/app/HomePage.module.css';

export function StarterRoute() {
  return (
    <section className={styles.route} aria-label="Этапы основного маршрута">
      <ol className={styles.routeList} aria-label="Этапы основного маршрута">
        {starterRouteSteps.map((step) => {
          const body = (
            <>
              <span className={styles.routeNum} aria-hidden="true">
                {step.number}
              </span>
              <span className={styles.routeStepText}>
                <span className={styles.routeStepTitle}>{step.title}</span>
                <span className={styles.routeStepDesc}>{step.description}</span>
                {step.status === 'upcoming' ? (
                  <span className={styles.routeSoon}>Скоро</span>
                ) : null}
              </span>
            </>
          );

          if (step.status === 'available' && step.path) {
            return (
              <li key={step.id} className={styles.routeItem}>
                <Link
                  to={step.path}
                  className={styles.routeStep}
                >
                  {body}
                </Link>
              </li>
            );
          }

          return (
            <li key={step.id} className={`${styles.routeItem} ${styles.routeItemUpcoming}`}>
              <div className={styles.routeStepUpcoming} aria-label={`${step.title}. Скоро`}>
                {body}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
