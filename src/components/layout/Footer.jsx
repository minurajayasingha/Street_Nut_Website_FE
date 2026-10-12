import styles from './Footer.module.css';

export default function Footer({ siteName }) {
  return (
    <footer className={styles.footer}>
      <form
        className={styles.form}
        aria-label="Newsletter"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Newsletter *"
          aria-label="Email"
          autoComplete="email"
        />
        <button className={styles.submit} type="submit" aria-label="Sign up">
          <svg
            className={styles.arrow}
            viewBox="0 0 16 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
          >
            <path d="M0 5h15M11 1l4 4-4 4" />
          </svg>
        </button>
      </form>
      <span className={styles.copyright}>
        &copy; {new Date().getFullYear()} {siteName}
      </span>
    </footer>
  );
}
