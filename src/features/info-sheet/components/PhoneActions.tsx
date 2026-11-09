import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  IconChevronDown as ChevronDown,
  IconCopy as Copy,
  IconMessageCircle as MessageCircle,
  IconPhone as Phone,
  IconSend as Send,
} from '../icons';
import styles from '../styles/app.module.css';
import { copyText } from '../utils/formatters';
import {
  buildMaxAppUrl,
  buildTelLink,
  buildTelegramLink,
  normalizePhoneDigits,
} from '../utils/phoneLinks';
import { useSession } from '../context/SessionContext';

type Props = {
  phone: string;
};

export function PhoneActions({ phone }: Props) {
  const { showToast } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 16, top: 16, width: 280 });
  const menuId = useId();
  const digits = normalizePhoneDigits(phone);
  const telegram = buildTelegramLink(phone);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(320, window.innerWidth - 32);
      const height = menuRef.current?.getBoundingClientRect().height ?? 280;
      const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16));
      const below = rect.bottom + 8;
      const top = below + height <= window.innerHeight - 16
        ? below
        : Math.max(16, rect.top - height - 8);
      setPosition({ left, top, width });
    };
    updatePosition();
    menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const onCall = () => {
    window.location.href = buildTelLink(phone);
    setOpen(false);
  };

  const onTelegram = () => {
    if (!telegram) {
      showToast('Некорректный номер для Telegram');
      return;
    }
    openExternal(telegram);
    showToast(
      'Открываем Telegram. Если чат не найден - номер скрыт или не зарегистрирован.',
    );
  };

  const onMax = async () => {
    const value = digits ? `+${digits}` : phone;
    const copied = await copyText(value);
    openExternal(buildMaxAppUrl());
    showToast(
      copied
        ? 'Номер скопирован. В Max: поиск → «Найти по номеру».'
        : 'Откройте Max и найдите контакт по номеру вручную.',
    );
  };

  const onCopy = async () => {
    const value = digits ? `+${digits}` : phone;
    const ok = await copyText(value);
    showToast(ok ? 'Телефон скопирован' : 'Не удалось скопировать');
    setOpen(false);
  };

  return (
    <>
    <div className={styles.phoneActions} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.phoneTrigger}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (open) menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
            else setOpen(true);
          }
        }}
      >
        <span>{phone}</span>
        <ChevronDown size={14} strokeWidth={2} aria-hidden />
      </button>
    </div>
      {open ? createPortal(
        <div className={`${styles.root} ${styles.floatingLayer}`}>
        <div
          ref={menuRef}
          className={styles.phoneMenu}
          style={position}
          id={menuId}
          role="menu"
          aria-label="Действия с телефоном"
          onKeyDown={(event) => {
            const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
            const index = items.indexOf(document.activeElement as HTMLButtonElement);
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              const direction = event.key === 'ArrowDown' ? 1 : -1;
              items[(index + direction + items.length) % items.length]?.focus();
            } else if (event.key === 'Home' || event.key === 'End') {
              event.preventDefault();
              items[event.key === 'Home' ? 0 : items.length - 1]?.focus();
            } else if (event.key === 'Tab') {
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <p className={styles.phoneMenuNote}>
            Приложение не проверяет регистрацию в мессенджерах на сервере -
            открывается выбранный клиент на вашем устройстве.
          </p>
          <button type="button" className={styles.phoneMenuItem} role="menuitem" onClick={onCall}>
            <Phone size={15} strokeWidth={2} />
            Позвонить
          </button>
          <button
            type="button"
            className={styles.phoneMenuItem}
            role="menuitem"
            onClick={onTelegram}
            disabled={!telegram}
          >
            <Send size={15} strokeWidth={2} />
            Открыть в Telegram
          </button>
          <button type="button" className={styles.phoneMenuItem} role="menuitem" onClick={() => void onMax()}>
            <MessageCircle size={15} strokeWidth={2} />
            Найти в Max
          </button>
          <button type="button" className={styles.phoneMenuItem} role="menuitem" onClick={() => void onCopy()}>
            <Copy size={15} strokeWidth={2} />
            Копировать номер
          </button>
        </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
