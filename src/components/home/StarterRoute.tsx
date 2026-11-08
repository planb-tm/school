import { Link } from 'react-router-dom';
import {
  starterRouteMeta,
  starterRouteSteps,
} from '@/data/home/starterRoute';
import styles from '@/app/HomePage.module.css';

export function StarterRoute() {
  return (
    <section className={styles.route} aria-labelledby="starter-route-title">
      <div className={styles.routeHeader}>
        <div className={styles.routeCopy}>
          <h2 id="starter-route-title" className={styles.routeTitle}>
            {starterRouteMeta.title}
          </h2>
          <p className={styles.routeSubtitle}>{starterRouteMeta.subtitle}</p>
        </div>
        <Link
          to={starterRouteMeta.ctaPath}
          state={{ from: 'home' }}
          className={`btn btn--accent ${styles.routeCta}`}
        >
          {starterRouteMeta.ctaLabel}
        </Link>
      </div>

      <ol className={styles.routeList}>
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
                  state={step.id === 'business-essence' ? { from: 'home' } : undefined}
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
