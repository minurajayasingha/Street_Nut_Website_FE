import { SIZE_ORDER, sizesFromStock } from './sizesFromStock';

test('sizes come out in the fixed order with availability from quantity', () => {
  const sizes = sizesFromStock({ XS: 0, S: 4, M: 10, L: 6, XL: 2, XXL: 0 });
  expect(sizes.map((s) => s.label)).toEqual(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  expect(sizes.map((s) => s.available)).toEqual([false, true, true, true, true, false]);
});

test('a size missing from the stock entry is unavailable', () => {
  const sizes = sizesFromStock({ M: 3 });
  expect(sizes).toHaveLength(SIZE_ORDER.length);
  expect(sizes.find((s) => s.label === 'M').available).toBe(true);
  expect(sizes.find((s) => s.label === 'S').available).toBe(false);
});

test('non-numeric, negative and missing stock never throws and counts as unavailable', () => {
  expect(sizesFromStock({ S: 'abc', M: -2, L: null, XL: undefined }).every((s) => !s.available)).toBe(true);
  expect(sizesFromStock().every((s) => !s.available)).toBe(true);
});

test('numeric strings count by value', () => {
  expect(sizesFromStock({ S: '3' }).find((s) => s.label === 'S').available).toBe(true);
});
