import { useEffect } from 'react';
import { useScrollLock } from '../../hooks/useScrollLock';
import styles from './Drawer.module.css';

export default function Drawer({ open, onClose, label, children }) {
  useScrollLock(open);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={styles.panel} role="dialog" aria-modal="true" aria-label={label}>
      <button className={styles.close} onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  );
}
