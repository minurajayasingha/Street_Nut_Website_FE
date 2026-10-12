import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products = [], label = 'Products', variant }) {
  const className = variant === 'search' ? `${styles.grid} ${styles.search}` : styles.grid;
  return (
    <ul className={className} aria-label={label}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
