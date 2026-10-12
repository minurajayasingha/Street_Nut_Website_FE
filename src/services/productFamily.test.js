import { getProductFamily, getProductBySlug } from './productService';

test('returns every colour of a family, each with its own slug', async () => {
  const family = await getProductFamily('fresh-foils-tee');
  expect(family).toHaveLength(4);
  expect(new Set(family.map((p) => p.slug)).size).toBe(4);
  family.forEach((p) => expect(p.family).toBe('fresh-foils-tee'));
});

test('family members carry sizes derived from stock', async () => {
  const [first] = await getProductFamily('fresh-foils-tee');
  expect(Array.isArray(first.sizes)).toBe(true);
});

test('unknown, empty or missing family gives an empty list', async () => {
  expect(await getProductFamily('no-such-family')).toEqual([]);
  expect(await getProductFamily('')).toEqual([]);
  expect(await getProductFamily()).toEqual([]);
});

test('a product can be found by slug and belongs to its own family', async () => {
  const product = await getProductBySlug('fresh-foils-tee-black');
  const family = await getProductFamily(product.family);
  expect(family.map((p) => p.slug)).toContain('fresh-foils-tee-black');
});
