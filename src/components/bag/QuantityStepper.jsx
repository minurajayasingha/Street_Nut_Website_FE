import styles from './QuantityStepper.module.css';

export default function QuantityStepper({ value, onChange }) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.change}
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
      >
        -
      </button>
      <input
        type="text"
        className={styles.value}
        aria-label="Quantity"
        inputMode="numeric"
        readOnly
        value={value}
      />
      <button
        type="button"
        className={styles.change}
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
