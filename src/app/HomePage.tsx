import { StarterRoute } from '@/components/home/StarterRoute';
import { SocialLinks } from '@/components/home/SocialLinks';
import { PageContainer } from '@/components/PageContainer';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <PageContainer className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle} tabIndex={-1}>Всё начинается с первого шага.</h1>
      </header>

      <StarterRoute />
      <SocialLinks />
    </PageContainer>
  );
}
