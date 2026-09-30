import { useState } from 'react';
import Caret from './Caret';
import styles from './Accordion.module.css';

export default function Accordion({ items, className }) {
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
              onClick={() => setOpenId(open ? null : item.id)}
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
