import ProductGrid from '../product/ProductGrid';
import styles from './SearchResults.module.css';

export default function SearchResults({ term, items, settled, centered = false }) {
  if (items.length > 0) {
    return <ProductGrid products={items} variant="search" label="Search results" />;
  }
  if (term && settled) {
    const className = centered ? `${styles.empty} ${styles.centered}` : styles.empty;
    return <p className={className}>No results for &ldquo;{term}&rdquo;</p>;
  }
  return null;
}
