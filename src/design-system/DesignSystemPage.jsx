import { useMemo, useState } from 'react';
import tokensCss from '../styles/tokens.css?raw';
import { parseTokens } from './tokensParser';
import { registry, GROUPS } from './registry';
import { Colors, Typography, TokenTables, Breakpoints } from './Foundations';
import styles from './DesignSystemPage.module.css';

const FOUNDATIONS = [
  { id: 'colors', title: 'Colors' },
  { id: 'typography', title: 'Typography' },
  { id: 'tokens', title: 'Tokens' },
  { id: 'breakpoints', title: 'Breakpoints' },
];

function EntryBlock({ entry }) {
  const { Demo } = entry;
  return (
    <article id={entry.id} className={styles.entry}>
      <h3 className={styles.entryTitle}>{entry.name}</h3>
      <p className={styles.muted}>
        <code>src/{entry.source}</code>
      </p>
      <p>{entry.description}</p>

      <div className={styles.demo}>
        <Demo />
      </div>

      {entry.props.length > 0 && (
        <table className={styles.tokenTable}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {entry.props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code>{prop.name}</code>
                </td>
                <td>
                  <code>{prop.type}</code>
                </td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <pre className={styles.code}>{entry.usage}</pre>
    </article>
  );
}

export default function DesignSystemPage() {
  const [query, setQuery] = useState('');
  const { groups, breakpoint } = useMemo(() => parseTokens(tokensCss), []);

  const needle = query.trim().toLowerCase();
  const visible = registry.filter(
    (entry) =>
      !needle ||
      [entry.name, entry.description, entry.source].some((text) => text.toLowerCase().includes(needle))
  );

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <p className={styles.brand}>Streetnut</p>
        <input
          type="search"
          className={styles.search}
          placeholder="Search components"
          aria-label="Search components"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <nav aria-label="Design system sections">
          <p className={styles.navGroup}>Foundations</p>
          {FOUNDATIONS.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={styles.navLink}>
              {item.title}
            </a>
          ))}
          {GROUPS.map((group) => {
            const entries = visible.filter((e) => e.group === group);
            if (entries.length === 0) return null;
            return (
              <div key={group}>
                <p className={styles.navGroup}>{group}</p>
                {entries.map((entry) => (
                  <a key={entry.id} href={`#${entry.id}`} className={styles.navLink}>
                    {entry.name}
                  </a>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className={styles.main}>
        <h1 className={styles.title}>Design System</h1>
        <p className={styles.muted}>
          Developer reference for Streetnut. Tokens are read live from <code>src/styles/tokens.css</code>. Every
          component in <code>src/components</code> must be listed in <code>src/design-system/registry.jsx</code>.
        </p>

        <h2 className={styles.groupTitle}>Foundations</h2>
        <section id="colors">
          <h3 className={styles.sectionTitle}>Colors</h3>
          <Colors groups={groups} />
        </section>
        <section id="typography">
          <h3 className={styles.sectionTitle}>Typography</h3>
          <Typography groups={groups} />
        </section>
        <section id="tokens">
          <h3 className={styles.sectionTitle}>Tokens</h3>
          <TokenTables groups={groups} />
        </section>
        <section id="breakpoints">
          <h3 className={styles.sectionTitle}>Breakpoints</h3>
          <Breakpoints breakpoint={breakpoint} />
        </section>

        {visible.length === 0 && <p>No components match your search.</p>}
        {GROUPS.map((group) => {
          const entries = visible.filter((e) => e.group === group);
          if (entries.length === 0) return null;
          return (
            <section key={group}>
              <h2 className={styles.groupTitle}>{group}</h2>
              {entries.map((entry) => (
                <EntryBlock key={entry.id} entry={entry} />
              ))}
            </section>
          );
        })}
      </main>
    </div>
  );
}
