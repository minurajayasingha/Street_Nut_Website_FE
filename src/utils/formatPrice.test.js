import { formatPrice } from './formatPrice';

test('whole amounts have no decimals', () => {
  expect(formatPrice(45, 'EUR')).toBe('€45');
});

test('fractional amounts keep two decimals', () => {
  expect(formatPrice(45.5, 'USD')).toBe('$45.50');
});

test('currency defaults to USD', () => {
  expect(formatPrice(10)).toBe('$10');
});

test('a null currency falls back to USD', () => {
  expect(formatPrice(10, null)).toBe('$10');
});
