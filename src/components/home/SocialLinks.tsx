import styles from './SocialLinks.module.css';

const socialLinks = [
  {
    name: 'Telegram',
    label: 'Telegram',
    description: '',
    href: 'https://t.me/dolina_nadya',
    title: 'Telegram',
    icon: 'telegram',
  },
  {
    name: 'ВКонтакте',
    label: 'Личная страница',
    description: 'личная страница',
    href: 'https://vk.ru/dolina_nadya',
    title: 'ВКонтакте - личная страница',
    icon: 'vk',
  },
  {
    name: 'ВКонтакте',
    label: 'Сообщество',
    description: 'сообщество',
    href: 'https://vk.ru/dolina_public',
    title: 'ВКонтакте - сообщество',
    icon: 'vk',
  },
  {
    name: 'Instagram',
    label: 'Instagram',
    description: '',
    href: 'https://www.instagram.com/dolina_nadya',
    title: 'Instagram',
    icon: 'instagram',
  },
] as const;

function SocialIcon({ name }: { name: (typeof socialLinks)[number]['icon'] }) {
  if (name === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.5 4.6 18.2 20c-.25 1.1-.9 1.35-1.8.85l-5-3.7-2.4 2.3c-.27.27-.5.5-1 .5l.36-5.1 9.3-8.4c.4-.36-.1-.56-.62-.2L5.55 13.4.62 11.86c-1.07-.33-1.08-1.07.22-1.58L20.1 2.82c.9-.33 1.69.22 1.4 1.78Z" />
      </svg>
    );
  }

  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.1" />
        <circle cx="12" cy="12" r="4.05" />
        <circle className={styles.instagramDot} cx="17.65" cy="6.55" r="1.05" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text x="12" y="16.2" textAnchor="middle">VK</text>
    </svg>
  );
}

export function SocialLinks() {
  return (
    <section className={styles.section} aria-labelledby="social-links-title">
      <div className={styles.copy}>
        <h2 id="social-links-title" className={styles.title}>Остаёмся на связи</h2>
        <p className={styles.description}>
          Вопросы по обучению или работе с Oriflame? Напиши мне или загляни в мои соцсети.
        </p>
      </div>

      <ul className={styles.list}>
        {socialLinks.map((link) => (
          <li className={styles.item} key={link.href}>
            <a
              className={styles.link}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.name}${link.description ? ` - ${link.description}` : ''}`}
              title={link.title}
            >
              <span className={styles.icon}>
                <SocialIcon name={link.icon} />
              </span>
              <span className={styles.label}>
                <span>{link.label}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
