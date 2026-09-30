import styles from './DataTable.module.css';

// First row is the underlined title; empty cells keep the column grid aligned.
export default function DataTable({ title, rows }) {
  const columns = rows[0]?.length ?? 1;
  return (
    <div className={styles.wrapper}>
      <table className={styles.table} aria-label={title}>
        <tbody>
          <tr>
            <td className={`${styles.label} ${styles.title}`}>
              <span>{title}</span>
            </td>
            {Array.from({ length: columns - 1 }, (_, i) => (
              <td key={i} className={styles.cell} />
            ))}
          </tr>
          {rows.map((row, r) => (
            <tr key={r}>
              <th scope="row" className={styles.label}>
                {row[0]}
              </th>
              {row.slice(1).map((value, c) => (
                <td key={c} className={styles.cell}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
