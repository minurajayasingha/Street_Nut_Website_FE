import { useState } from 'react';
import { hasContent } from '../../utils/hasContent';
import styles from './SizeChart.module.css';

// chart: { notes?: string[], units: { id, label, rows: string[][] }[], image?, imageAlt? }
// rows[0] is the header (Size, XS, S...), the first cell of each row is its label.
export default function SizeChart({ chart }) {
  const units = (chart?.units ?? []).filter((unit) => unit?.rows?.length > 0);
  const [unitId, setUnitId] = useState(units[0]?.id);
  const unit = units.find((u) => u.id === unitId) ?? units[0];
  if (!unit) return null;

  const [header, ...rows] = unit.rows;
  const notes = (chart.notes ?? []).filter(hasContent);

  return (
    <div className={styles.chart}>
      {notes.map((note) => (
        <p key={note} className={styles.note}>
          {note}
        </p>
      ))}

      {units.length > 1 && (
        <div className={styles.toggle} role="group" aria-label="Units">
          {units.map((u) => (
            <button
              key={u.id}
              type="button"
              className={styles.unit}
              aria-pressed={u.id === unit.id}
              onClick={() => setUnitId(u.id)}
            >
              {u.label}
            </button>
          ))}
        </div>
      )}

      {/* Wide tables scroll sideways inside the column instead of being cut off */}
      <div className={styles.scroll} role="region" aria-label="Size chart" tabIndex={0}>
        <table className={styles.table} aria-label={`${unit.label} size chart`}>
          <thead>
            <tr>
              {header.map((cell, index) => (
                <th key={index} scope="col" className={index === 0 ? styles.label : styles.cell}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                <th scope="row" className={styles.label}>
                  {row[0]}
                </th>
                {row.slice(1).map((value, c) => (
                  <td key={c} className={`${styles.cell} ${styles.value}`}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasContent(chart.image) && (
        <img
          className={styles.image}
          src={chart.image}
          alt={chart.imageAlt ?? ''}
          // width and height reserve the space, so the column does not grow after it is scrolled
          width={chart.imageSize?.[0]}
          height={chart.imageSize?.[1]}
        />
      )}
    </div>
  );
}
