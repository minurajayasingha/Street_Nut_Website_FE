import { useState } from 'react';
import Caret from './Caret';
import styles from './Accordion.module.css';

// onChange(id | null) reports the open item after every toggle (null when it closes).
export default function Accordion({ items, className, onChange }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className={className}>
      {items.map((item) => {
        const open = item.id === openId;
        const panelId = `accordion-panel-${item.id}`;
        return (
          <div key={item.id} className={styles.item}>
            <button
              type="button"
              className={styles.header}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => {
                const next = open ? null : item.id;
                setOpenId(next);
                onChange?.(next);
              }}
            >
              <span>{item.title}</span>
              <Caret
                className={open ? `${styles.icon} ${styles.iconOpen}` : styles.icon}
                width="7"
                height="5"
              />
            </button>
            {open && (
              <div id={panelId} className={styles.content}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
