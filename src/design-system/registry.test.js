import { registry, GROUPS } from './registry';

// Every component file must be documented on the design system page.
const componentFiles = Object.keys(import.meta.glob('../components/**/*.jsx'))
  .filter((path) => !path.endsWith('.test.jsx'))
  .map((path) => path.replace('../', ''));

test('every file in src/components has a design system entry', () => {
  const documented = new Set(registry.map((entry) => entry.source));
  const missing = componentFiles.filter((file) => !documented.has(file));
  expect(missing).toEqual([]);
});

test('entries are well formed and uniquely named', () => {
  const ids = registry.map((e) => e.id);
  const names = registry.map((e) => e.name);
  expect(new Set(ids).size).toBe(ids.length);
  expect(new Set(names).size).toBe(names.length);
  registry.forEach((entry) => {
    expect(GROUPS).toContain(entry.group);
    expect(entry.description).toBeTruthy();
    expect(entry.source).toMatch(/\.jsx$/);
    expect(typeof entry.Demo).toBe('function');
  });
});
