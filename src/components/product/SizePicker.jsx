import styles from './SizePicker.module.css';

export default function SizePicker({ sizes = [], value, onChange }) {
  if (sizes.length === 0) return null;

  return (
    <div className={styles.group} role="radiogroup" aria-label="Size">
      {sizes.map(({ label, available }) => (
        <label key={label} className={styles.size}>
          <input
            type="radio"
            name="size"
            value={label}
            className={styles.input}
            checked={value === label}
            disabled={!available}
            onChange={() => onChange(label)}
          />
          <span className={styles.label}>{label}</span>
        </label>
      ))}
    </div>
  );
}
