import { StarterRoute } from '@/components/home/StarterRoute';
import { SocialLinks } from '@/components/home/SocialLinks';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <div className={`home-page--wide ${styles.page}`}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Всё начинается с первого шага.</h1>
        <p className={styles.heroLead}>
          Материалы, инструменты и последовательность действий для развития своего
          дела.
        </p>
      </header>

      <StarterRoute />
      <SocialLinks />
    </div>
  );
}
