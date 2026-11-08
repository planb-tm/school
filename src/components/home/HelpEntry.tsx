import styles from '@/app/HomePage.module.css';

/** Anchor target for AppHeader «Помощь». Not a separate route. */
export const HOME_HELP_ID = 'home-help';

export function HelpEntry() {
  return (
    <section
      id={HOME_HELP_ID}
      className={styles.help}
      aria-labelledby="home-help-title"
      tabIndex={-1}
    >
      <h2 id="home-help-title" className={styles.sectionTitle}>
        Помощь
      </h2>
      <div className={styles.helpBody}>
        <p>
          planB помогает разобраться в материалах и инструментах команды. Если
          непонятно, с чего начать, открой маршрут новичка на этой странице.
        </p>
        <p>
          По рабочим правилам Oriflame, условиям вознаграждения и официальным
          данным сверяйся с кабинетом партнёра и актуальными документами
          компании.
        </p>
      </div>
    </section>
  );
}
