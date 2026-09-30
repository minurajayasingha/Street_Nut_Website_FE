import styles from './PlaceholderPage.module.css';

export default function PlaceholderPage({ title, tone }) {
  return (
    <div className={styles.root}>
      <h1 className={styles.title} data-tone={tone}>
        {title}
      </h1>
    </div>
  );
}
