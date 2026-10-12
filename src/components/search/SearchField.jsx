import { Link } from 'react-router-dom';
import { searchPath } from '../../utils/searchPath';
import styles from './SearchField.module.css';

export default function SearchField({
  variant,
  value,
  onChange,
  onSubmit,
  onClear,
  inputRef,
  showEnter = true,
  showViewAll = true,
}) {
  const hasTerm = value.trim() !== '';

  const handleSubmit = (event) => {
    event.preventDefault();
    if (hasTerm) onSubmit(value.trim());
  };

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        aria-label="Search"
        placeholder="Search here"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {variant === 'bar' && hasTerm && (
        <>
          {showViewAll && (
            <Link className={styles.action} to={searchPath(value)}>
              View all results
            </Link>
          )}
          <button type="button" className={styles.action} onClick={onClear}>
            Clear
          </button>
        </>
      )}
      {variant === 'strip' && hasTerm && showEnter && (
        <button type="submit" className={styles.action}>
          Enter
        </button>
      )}
    </form>
  );
}
