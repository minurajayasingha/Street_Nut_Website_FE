import styles from './Footer.module.css';

export default function Footer({ siteName }) {
  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>
        &copy; {new Date().getFullYear()} {siteName}
      </span>
    </footer>
  );
}
