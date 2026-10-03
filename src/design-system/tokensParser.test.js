import { parseTokens } from './tokensParser';

const css = `
:root {
  --a: 1px;

  /* Group B */
  --b: red;
  --c: var(--a);
}

/* Desktop breakpoint */
@media (min-width: 1025px) {
  :root {
    --a: 2px;
    --d: 3px;
  }
}
`;

test('groups tokens by the comment above them, defaulting to Core', () => {
  const { groups } = parseTokens(css);
  expect(groups.map((g) => g.name)).toEqual(['Core', 'Group B', 'Desktop only']);
  expect(groups[1].tokens.map((t) => t.name)).toEqual(['--b', '--c']);
});

test('merges desktop overrides onto base tokens', () => {
  const { groups } = parseTokens(css);
  const a = groups[0].tokens[0];
  expect(a).toEqual({ name: '--a', value: '1px', desktop: '2px' });
  expect(groups[1].tokens[0].desktop).toBeNull();
});

test('desktop-only tokens go in their own group and the breakpoint is read', () => {
  const { groups, breakpoint } = parseTokens(css);
  expect(groups[2].tokens).toEqual([{ name: '--d', value: null, desktop: '3px' }]);
  expect(breakpoint).toBe('1025px');
});

test('parses the real tokens.css without losing tokens', async () => {
  const raw = (await import('../styles/tokens.css?raw')).default;
  const { groups } = parseTokens(raw);
  const names = groups.flatMap((g) => g.tokens.map((t) => t.name));
  expect(names).toContain('--font-body');
  expect(names).toContain('--nav-left');
  expect(new Set(names).size).toBe(names.length);
});
