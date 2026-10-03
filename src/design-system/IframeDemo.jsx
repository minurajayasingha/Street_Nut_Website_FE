import { useState } from 'react';
import styles from './DesignSystemPage.module.css';

const WIDTHS = [390, 768, 1025, 1440];

// Layout-level pieces depend on the viewport width, so they are previewed in a frame of the real
// site. The frame has its own viewport, which makes the width buttons trigger the real breakpoints.
export default function IframeDemo({ path, height = 520 }) {
  const [width, setWidth] = useState(1440);

  return (
    <div className={styles.frameDemo}>
      <div className={styles.frameBar}>
        <span className={styles.frameLabel}>Live preview of {path}</span>
        <div className={styles.frameWidths} role="group" aria-label="Preview width">
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              className={w === width ? styles.widthActive : styles.widthButton}
              aria-pressed={w === width}
              onClick={() => setWidth(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.frameScroller}>
        <iframe
          title={`Preview of ${path} at ${width}px`}
          src={path}
          className={styles.frame}
          style={{ width, height }}
        />
      </div>
    </div>
  );
}
