import { useState } from 'react';
import styles from './AnnouncementBar.module.css';

const STORAGE_KEY = 'streetnut:announcement-dismissed';

const readDismissed = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeDismissed = (text) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, text);
  } catch {
    // Storage blocked: the bar still hides for this page view.
  }
};

export default function AnnouncementBar({ text }) {
  const [dismissed, setDismissed] = useState(readDismissed);
  if (!text || dismissed === text) return null;
  return (
    <div className={styles.bar} role="region" aria-label="Announcement">
      <span className={styles.text}>{text}</span>
      <span className={styles.dash} aria-hidden="true">-</span>
      <button
        className={styles.hide}
        onClick={() => {
          writeDismissed(text);
          setDismissed(text);
        }}
      >
        Hide
      </button>
    </div>
  );
}
