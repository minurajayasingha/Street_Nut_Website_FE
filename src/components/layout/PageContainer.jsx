import styles from './PageContainer.module.css';

export default function PageContainer({ children, flushTablet = false, className }) {
  const classes = [styles.container, flushTablet && styles.flushTablet, className]
    .filter(Boolean)
    .join(' ');
  return <div className={classes}>{children}</div>;
}

export function PageTitle({ as: Tag = 'h1', className, children }) {
  return <Tag className={className ? `${styles.title} ${className}` : styles.title}>{children}</Tag>;
}
