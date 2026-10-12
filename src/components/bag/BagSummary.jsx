import { formatPrice } from '../../utils/formatPrice';
import styles from './BagSummary.module.css';

export default function BagSummary({ subtotal, currency, taxNote, shippingNote }) {
  return (
    <div className={styles.summary}>
      {taxNote && <p className={styles.note}>{taxNote}</p>}
      {shippingNote && <p className={`${styles.note} ${styles.shipping}`}>{shippingNote}</p>}
      <div className={styles.subtotal}>
        <p>Subtotal</p>
        <p>{formatPrice(subtotal, currency)}</p>
      </div>
    </div>
  );
}
