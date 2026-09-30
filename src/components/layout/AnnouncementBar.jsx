import { useState } from 'react';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar({ text }) {
  const [hidden, setHidden] = useState(false);
  if (!text || hidden) return null;
  return (
    <div className={styles.bar} role="region" aria-label="Announcement">
      <span className={styles.text}>{text}</span>
      <span className={styles.dash} aria-hidden="true">-</span>
      <button className={styles.hide} onClick={() => setHidden(true)}>
        Hide
      </button>
    </div>
  );
}
