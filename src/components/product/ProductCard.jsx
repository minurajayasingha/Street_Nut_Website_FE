import { Link } from 'react-router-dom';
import SizeList from './SizeList';
import { formatPrice } from '../../utils/formatPrice';
import { getProductState } from '../../utils/productState';
import styles from './ProductCard.module.css';

function getImages(product) {
  if (product.images?.length) return product.images;
  return product.image ? [product.image] : [];
}

function getNote(product) {
  if (product.badge) return product.badge;
  return product.colors > 1 ? `${product.colors} colours` : null;
}

export default function ProductCard({ product }) {
  const { slug, name, price, currency } = product;
  const state = getProductState(product);
  const soldOut = state === 'soldOut';
  const [featured, second] = getImages(product);
  const note = getNote(product);
  const href = `/products/${slug}`;
  const priceText = soldOut ? 'Sold out' : price != null ? formatPrice(price, currency) : null;

  return (
    <article
      className={soldOut ? `${styles.card} ${styles.soldOut}` : styles.card}
      data-state={state}
    >
      <Link to={href} className={styles.imageLink} aria-hidden="true" tabIndex={-1}>
        <span className={styles.track} tabIndex={-1}>
          <span className={styles.slide}>
            {featured && <img src={featured} alt={name} loading="lazy" />}
          </span>
          {second && (
            <span className={`${styles.slide} ${styles.slideAlt}`}>
              <img src={second} alt="" loading="lazy" />
            </span>
          )}
        </span>
      </Link>
      <div className={styles.info}>
        <Link to={href} className={styles.title}>
          {name}
        </Link>
        {priceText && <p className={styles.price}>{priceText}</p>}
        {note && <p className={styles.note}>{note}</p>}
        {soldOut ? (
          <div className={styles.spacer} aria-hidden="true" />
        ) : (
          <SizeList slug={slug} name={name} sizes={state === 'oneSize' ? [] : product.sizes} />
        )}
      </div>
    </article>
  );
}
