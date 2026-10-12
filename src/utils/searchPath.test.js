import { searchPath } from './searchPath';

test('builds the results URL from a trimmed, encoded term', () => {
  expect(searchPath('  fresh foils ')).toBe('/search?q=fresh%20foils');
  expect(searchPath('a&b')).toBe('/search?q=a%26b');
});

test('a missing term gives an empty query', () => {
  expect(searchPath()).toBe('/search?q=');
});
