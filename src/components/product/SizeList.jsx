import { Link } from 'react-router-dom';
import styles from './SizeList.module.css';

export default function SizeList({ slug, name, sizes }) {
  return (
    <div className={styles.row} data-testid="size-row">
      {sizes.length > 0 && (
        <ul className={styles.list}>
          {sizes.map(({ label, available }) => (
            <li key={label}>
              {available ? (
                <Link
                  to={`/products/${slug}?size=${encodeURIComponent(label)}`}
                  className={styles.size}
                  aria-label={`View ${name}, size ${label}`}
                >
                  {label}
                </Link>
              ) : (
                <span className={`${styles.size} ${styles.unavailable}`} aria-disabled="true">
                  {label}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
