import styles from './AddToBag.module.css';

export default function AddToBag({ disabled = false, onClick }) {
  return (
    <button type="button" className={styles.button} disabled={disabled} onClick={onClick}>
      Add to bag
    </button>
  );
}
