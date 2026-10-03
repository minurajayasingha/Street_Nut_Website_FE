import styles from './DesignSystemPage.module.css';

const flatten = (groups) => groups.flatMap((g) => g.tokens);
const isPx = (value) => /^\d+(\.\d+)?px$/.test(value ?? '');

export function Colors({ groups }) {
  const colors = flatten(groups).filter((t) => t.name.startsWith('--color-'));
  return (
    <div className={styles.swatches}>
      {colors.map((token) => (
        <div key={token.name} className={styles.swatch}>
          <div className={styles.swatchChip} style={{ background: `var(${token.name})` }} />
          <code>{token.name}</code>
          <span className={styles.muted}>{token.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Typography({ groups }) {
  const tokens = flatten(groups);
  const sizes = tokens.filter((t) => t.name.startsWith('--fs-'));
  const weights = tokens.filter((t) => t.name.startsWith('--fw-'));
  const lineHeights = tokens.filter((t) => t.name.startsWith('--lh-'));
  const font = tokens.find((t) => t.name === '--font-body');

  return (
    <>
      <h4 className={styles.subTitle}>Font family</h4>
      <p className={styles.specimen} style={{ fontFamily: 'var(--font-body)', fontSize: 28 }}>
        Streetnut Aa Bb Cc 0123456789
      </p>
      <p className={styles.muted}>
        <code>--font-body</code>: {font?.value}
      </p>
      <p className={styles.muted}>
        The reference uses licensed Helvetica Neue; Streetnut falls back to Helvetica or Arial. Site text is
        uppercase (set once in global.css).
      </p>

      <h4 className={styles.subTitle}>Weights</h4>
      <div className={styles.specimenList}>
        {weights.map((t) => (
          <div key={t.name} className={styles.specimenRow}>
            <code>{t.name}</code>
            <span className={styles.muted}>{t.value}</span>
            <span style={{ fontWeight: `var(${t.name})`, fontSize: 18 }}>Streetnut free shipping</span>
          </div>
        ))}
      </div>

      <h4 className={styles.subTitle}>Font sizes (shown uppercase, as on the site)</h4>
      <div className={styles.specimenList}>
        {sizes.map((t) => (
          <div key={t.name} className={styles.specimenRow}>
            <code>{t.name}</code>
            <span className={styles.muted}>{t.value}</span>
            <span
              style={{
                fontSize: `var(${t.name})`,
                fontWeight: 'var(--fw-medium)',
                textTransform: 'uppercase',
              }}
            >
              New arrivals. Free standard shipping on orders over 150
            </span>
          </div>
        ))}
      </div>

      <h4 className={styles.subTitle}>Line heights</h4>
      <div className={styles.specimenList}>
        {lineHeights.map((t) => (
          <div key={t.name} className={styles.specimenRow}>
            <code>{t.name}</code>
            <span className={styles.muted}>{t.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function TokenTables({ groups }) {
  return groups.map((group) => (
    <section key={group.name} className={styles.tokenGroup}>
      <h4 className={styles.subTitle}>{group.name}</h4>
      <table className={styles.tokenTable}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            <th>1025px and up</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {group.tokens.map((token) => (
            <tr key={token.name}>
              <td>
                <code>{token.name}</code>
              </td>
              <td>{token.value ?? '-'}</td>
              <td>{token.desktop ?? '-'}</td>
              <td>
                {isPx(token.desktop ?? token.value) && (
                  <span className={styles.bar} style={{ width: `var(${token.name})` }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  ));
}

export function Breakpoints({ breakpoint }) {
  return (
    <>
      <p>
        One breakpoint, measured on the reference: <code>{breakpoint ?? '1025px'}</code>. Below it is mobile
        (SEARCH / BAG / MENU header, drawer menu). At or above it is desktop (left side nav, announcement).
      </p>
      <p className={styles.muted}>
        Use <code>@media (min-width: {breakpoint ?? '1025px'})</code> for desktop-only styles and{' '}
        <code>@media (max-width: 1024px)</code> to hide things on mobile. Each live preview below has width buttons
        (390, 768, 1025, 1440) so you can check both sides.
      </p>
    </>
  );
}
