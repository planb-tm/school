import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HelpEntry, HOME_HELP_ID } from '@/components/home/HelpEntry';
import { QuickAccess } from '@/components/home/QuickAccess';
import { StarterRoute } from '@/components/home/StarterRoute';
import { UsefulInformation } from '@/components/home/UsefulInformation';
import styles from './HomePage.module.css';

function scrollToHomeHelp(behavior: ScrollBehavior = 'smooth') {
  const target = document.getElementById(HOME_HELP_ID);
  if (!target) return;
  target.scrollIntoView({ behavior, block: 'start' });
  target.focus({ preventScroll: true });
}

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== `#${HOME_HELP_ID}`) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => {
      scrollToHomeHelp(reduceMotion ? 'auto' : 'smooth');
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  return (
    <div className={`home-page--wide ${styles.page}`}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Всё начинается с первого шага.</h1>
        <p className={styles.heroLead}>
          Материалы, инструменты и последовательность действий для развития своего
          дела.
        </p>
      </header>

      <div className={styles.mainGrid}>
        <StarterRoute />
        <div className={styles.sidebar}>
          <UsefulInformation />
        </div>
      </div>

      <QuickAccess />
      <HelpEntry />
    </div>
  );
}
