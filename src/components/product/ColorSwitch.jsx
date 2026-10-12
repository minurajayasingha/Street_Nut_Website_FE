import { Link } from 'react-router-dom';
import styles from './ColorSwitch.module.css';

export default function ColorSwitch({ products = [], currentSlug }) {
  if (products.length < 2) return null;

  return (
    <ul className={styles.list} aria-label="Colours">
      {products.map(({ slug, name, color, images }) => {
        const current = slug === currentSlug;
        const label = color ?? name;
        return (
          <li key={slug}>
            <Link
              to={`/products/${slug}`}
              className={styles.swatch}
              aria-label={label}
              aria-current={current ? 'true' : undefined}
            >
              {images?.[0] ? <img src={images[0]} alt="" /> : <span>{label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
