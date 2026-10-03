import { getProductState } from './productState';

const size = (label, available = true) => ({ label, available });

test.each([
  ['some sizes available', { sizes: [size('S'), size('M', false)] }, 'default'],
  ['every size unavailable', { sizes: [size('S', false), size('M', false)] }, 'soldOut'],
  ['soldOut flag set', { soldOut: true, sizes: [size('S')] }, 'soldOut'],
  ['no sizes field', {}, 'oneSize'],
  ['empty sizes', { sizes: [] }, 'oneSize'],
  ['single "One size"', { sizes: [size('One size')] }, 'oneSize'],
  ['single "OS"', { sizes: [size('OS')] }, 'oneSize'],
  ['one-size but unavailable', { sizes: [size('One size', false)] }, 'soldOut'],
  ['soldOut flag beats one-size', { soldOut: true }, 'soldOut'],
  ['a single normal size is not one-size', { sizes: [size('M')] }, 'default'],
])('%s', (_name, product, expected) => {
  expect(getProductState(product)).toBe(expected);
});
