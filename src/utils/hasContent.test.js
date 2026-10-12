import { hasContent } from './hasContent';

test('empty values are not content', () => {
  expect(hasContent(undefined)).toBe(false);
  expect(hasContent(null)).toBe(false);
  expect(hasContent('')).toBe(false);
  expect(hasContent('   ')).toBe(false);
  expect(hasContent([])).toBe(false);
  expect(hasContent(['', '  ', null])).toBe(false);
});

test('real values are content', () => {
  expect(hasContent('Cotton')).toBe(true);
  expect(hasContent(0)).toBe(true);
  expect(hasContent(['', 'Cotton'])).toBe(true);
  expect(hasContent({ a: 1 })).toBe(true);
});
