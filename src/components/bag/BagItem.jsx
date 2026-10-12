import { Link } from 'react-router-dom';
import QuantityStepper from './QuantityStepper';
import { formatPrice } from '../../utils/formatPrice';
import styles from './BagItem.module.css';

export default function BagItem({ item, onQuantityChange, onNavigate }) {
  const variant = [item.color, item.size].filter(Boolean).join(' / ');
  return (
    <li className={styles.item}>
      <Link to={`/products/${item.slug}`} className={styles.image} onClick={onNavigate}>
        <img src={item.image} alt={item.name} />
      </Link>
      <div className={styles.detail}>
        <h3 className={styles.title}>{item.name}</h3>
        {variant && (
          <p className={styles.row} data-variant>
            {variant}
          </p>
        )}
        <p className={styles.row}>{formatPrice(item.price, item.currency)}</p>
        <QuantityStepper value={item.quantity} onChange={onQuantityChange} />
      </div>
    </li>
  );
}
