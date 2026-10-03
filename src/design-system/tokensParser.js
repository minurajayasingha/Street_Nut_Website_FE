// Reads src/styles/tokens.css as text so the design system page never drifts from the real tokens.
// A comment line starts a new group; tokens inside the @media block become desktop overrides.
const TOKEN_LINE = /^(--[\w-]+)\s*:\s*(.+?);$/;
const COMMENT_LINE = /^\/\*\s*(.+?)\s*\*\/$/;
const count = (line, char) => line.split(char).length - 1;

export function parseTokens(css) {
  const base = [];
  const desktop = new Map();
  let group = 'Core';
  let depth = 0;
  let mediaDepth = null;
  let breakpoint = null;

  for (const raw of css.split('\n')) {
    const line = raw.trim();

    if (mediaDepth === null && line.startsWith('@media')) {
      mediaDepth = depth;
      breakpoint = line.match(/min-width:\s*([\d.]+px)/)?.[1] ?? null;
    }

    const comment = line.match(COMMENT_LINE);
    if (comment) {
      if (mediaDepth === null) group = comment[1];
      continue;
    }

    const token = line.match(TOKEN_LINE);
    if (token) {
      const [, name, value] = token;
      if (mediaDepth === null) base.push({ group, name, value });
      else desktop.set(name, value);
    }

    depth += count(line, '{') - count(line, '}');
    if (mediaDepth !== null && depth <= mediaDepth) mediaDepth = null;
  }

  const groups = [];
  const byName = new Map();
  for (const { group: groupName, name, value } of base) {
    if (!byName.has(groupName)) {
      const entry = { name: groupName, tokens: [] };
      byName.set(groupName, entry);
      groups.push(entry);
    }
    byName.get(groupName).tokens.push({ name, value, desktop: desktop.get(name) ?? null });
  }

  const baseNames = new Set(base.map((t) => t.name));
  const desktopOnly = [...desktop]
    .filter(([name]) => !baseNames.has(name))
    .map(([name, value]) => ({ name, value: null, desktop: value }));
  if (desktopOnly.length > 0) groups.push({ name: 'Desktop only', tokens: desktopOnly });

  return { groups, breakpoint };
}
