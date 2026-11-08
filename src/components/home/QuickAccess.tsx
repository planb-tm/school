import { Link } from 'react-router-dom';
import {
  quickAccessItems,
  quickAccessMeta,
  type QuickAccessIcon,
} from '@/data/home/quickAccess';
import {
  IconBook,
  IconCalculator,
  IconLearn,
  IconTools,
} from '@/components/Icons';
import styles from '@/app/HomePage.module.css';

function AccessIcon({ name }: { name: QuickAccessIcon }) {
  switch (name) {
    case 'calculator':
      return <IconCalculator size={20} />;
    case 'sheet':
      return <IconTools size={20} />;
    case 'messages':
      return <IconLearn size={20} />;
    case 'learn':
      return <IconBook size={20} />;
  }
}

export function QuickAccess() {
  return (
    <section className={styles.quick} aria-labelledby="quick-access-title">
      <h2 id="quick-access-title" className={styles.sectionTitle}>
        {quickAccessMeta.title}
      </h2>
      <ul className={styles.quickList}>
        {quickAccessItems.map((item) => (
          <li key={item.id}>
            <Link to={item.path} className={styles.quickItem}>
              <span className={styles.quickIcon} aria-hidden="true">
                <AccessIcon name={item.icon} />
              </span>
              <span className={styles.quickText}>
                <span className={styles.quickItemTitle}>{item.title}</span>
                <span className={styles.quickItemDesc}>{item.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
