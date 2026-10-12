import { useEffect, useRef } from 'react';
import { useBag } from '../../hooks/useBag';
import { useScrollLock } from '../../hooks/useScrollLock';
import BagItem from './BagItem';
import BagSummary from './BagSummary';
import BagEmpty from './BagEmpty';
import styles from './BagDrawer.module.css';

export default function BagDrawer() {
  const { open, items, info, subtotal, currency, closeBag, setQuantity } = useBag();
  const panelRef = useRef(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    panelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') closeBag();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open, closeBag]);

  if (!open) return null;
  const empty = items.length === 0;

  return (
    <>
      <div className={styles.overlay} data-testid="bag-overlay" onClick={closeBag} />
      <div
        ref={panelRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Shopping bag</h2>
          <button type="button" className={styles.close} onClick={closeBag}>
            Close
          </button>
        </header>
        <div className={styles.content}>
          {empty ? (
            <BagEmpty message={info.emptyMessage} shippingNote={info.shippingNote} />
          ) : (
            <>
              <ul className={styles.list}>
                {items.map((item) => (
                  <BagItem
                    key={item.id}
                    item={item}
                    onNavigate={closeBag}
                    onQuantityChange={(quantity) => setQuantity(item.id, quantity)}
                  />
                ))}
              </ul>
              <BagSummary
                subtotal={subtotal}
                currency={currency}
                taxNote={info.taxNote}
                shippingNote={info.shippingNote}
              />
            </>
          )}
        </div>
        <footer className={styles.footer}>
          {empty ? (
            <button type="button" className={styles.button} onClick={closeBag}>
              Continue shopping
            </button>
          ) : (
            <button type="button" className={styles.button}>
              Checkout
            </button>
          )}
        </footer>
      </div>
    </>
  );
}
