import styles from './BagEmpty.module.css';

export default function BagEmpty({ message, shippingNote }) {
  return (
    <div className={styles.empty}>
      {message && <p>{message}</p>}
      {shippingNote && <p>{shippingNote}</p>}
    </div>
  );
}
