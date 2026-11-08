import styles from '@/app/HomePage.module.css';

export function UsefulInformation() {
  return (
    <aside className={styles.useful} aria-labelledby="useful-info-title">
      <h2 id="useful-info-title" className={styles.usefulTitle}>
        Полезно знать
      </h2>
      <p className={styles.usefulText}>
        Не нужно изучать всё сразу. Двигайся последовательно и возвращайся к
        материалам, когда они понадобятся.
      </p>
    </aside>
  );
}
