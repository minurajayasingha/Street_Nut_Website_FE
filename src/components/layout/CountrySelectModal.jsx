import { useEffect, useId, useState } from 'react';
import { useScrollLock } from '../../hooks/useScrollLock';
import Caret from '../ui/Caret';
import styles from './CountrySelectModal.module.css';

// UI only: Save closes the dialog. Persisting the choice is wired up with the backend later.
export default function CountrySelectModal({ open, onClose, region }) {
  const titleId = useId();
  const selectId = useId();
  const countries = region?.countries ?? [];
  const [code, setCode] = useState(region?.selected ?? countries[0]?.code ?? '');

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

  const onSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className={styles.overlay} data-testid="country-overlay">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
            <path d="M1 1L14 14M14 1L1 14" stroke="currentColor" strokeWidth="1.25" fill="none" />
          </svg>
        </button>
        <form className={styles.form} onSubmit={onSubmit}>
          <h2 id={titleId} className={styles.title}>{region?.title}</h2>
          <label htmlFor={selectId} className={styles.label}>{region?.prompt}</label>
          <div className={styles.selectWrap}>
            <select
              id={selectId}
              className={styles.select}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} / {c.currency}
                </option>
              ))}
            </select>
            <Caret className={styles.caret} width="7" height="5" />
          </div>
          <button type="submit" className={styles.save}>{region?.save}</button>
        </form>
      </div>
    </div>
  );
}
