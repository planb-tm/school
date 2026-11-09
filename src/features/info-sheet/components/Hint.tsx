import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconHelpCircle as HelpCircle } from '../icons';
import styles from '../styles/app.module.css';

export function Hint({ text, label = 'Подсказка' }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 16, top: 16, width: 240 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const openBeforePointerDown = useRef(false);
  const pointerType = useRef('mouse');
  const id = useId();

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(280, window.innerWidth - 32);
      const height = bubbleRef.current?.getBoundingClientRect().height ?? 80;
      const left = Math.max(16, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 16));
      const below = rect.bottom + 8;
      const top = below + height <= window.innerHeight - 16
        ? below
        : Math.max(16, rect.top - height - 8);
      setPosition({ left, top, width });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, text]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!triggerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
    <button
      ref={triggerRef}
      type="button"
      className={styles.hintBtn}
      aria-label={label}
      aria-describedby={open ? id : undefined}
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') setOpen(true); }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch' && document.activeElement !== event.currentTarget) setOpen(false);
      }}
      onPointerDown={(event) => {
        openBeforePointerDown.current = open;
        pointerType.current = event.pointerType;
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => {
        e.preventDefault();
        setOpen(e.detail === 0 || pointerType.current === 'mouse' ? true : !openBeforePointerDown.current);
      }}
    >
      <HelpCircle size={14} strokeWidth={2} />
    </button>
    {open ? createPortal(
      <div className={`${styles.root} ${styles.floatingLayer}`}>
        <span ref={bubbleRef} className={styles.hintBubble} style={position} id={id} role="tooltip">{text}</span>
      </div>,
      document.body,
    ) : null}
    </>
  );
}
