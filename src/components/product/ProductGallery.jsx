import { hasContent } from '../../utils/hasContent';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images = [], label }) {
  const list = images.filter(hasContent);
  if (list.length === 0) return null;

  return (
    <ul className={styles.gallery} aria-label={`${label} images`}>
      {list.map((src, index) => (
        <li key={src} className={styles.slide}>
          <img
            src={src}
            alt={`${label}, image ${index + 1}`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </li>
      ))}
    </ul>
  );
}
