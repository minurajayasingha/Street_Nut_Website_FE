import { searchProducts, getProductBySlug } from './productService';

test('search matches the product name, ignoring case', async () => {
  const results = await searchProducts('FRESH foils');
  expect(results).toHaveLength(4);
  results.forEach((p) => expect(p.family).toBe('fresh-foils-tee'));
});

test('search matches name and colour words in any order', async () => {
  const results = await searchProducts('black tee');
  expect(results.map((p) => p.slug)).toContain('fresh-foils-tee-black');
  results.forEach((p) => expect(`${p.name} ${p.color}`.toLowerCase()).toMatch(/black/));
});

test('search results carry the same sizes as getProductBySlug', async () => {
  const [first] = await searchProducts('fresh foils');
  expect(first).toEqual(await getProductBySlug(first.slug));
});

test('search with an empty, blank or missing term returns nothing', async () => {
  expect(await searchProducts('')).toEqual([]);
  expect(await searchProducts('   ')).toEqual([]);
  expect(await searchProducts()).toEqual([]);
});

test('search with no match, or regex characters, returns nothing and does not throw', async () => {
  expect(await searchProducts('zzzzqq')).toEqual([]);
  for (const term of ['(', '[a-', '.*', '\\']) {
    expect(await searchProducts(term)).toEqual([]);
  }
});
