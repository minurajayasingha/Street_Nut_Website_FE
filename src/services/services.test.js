import { getSiteInfo } from './siteService';
import { getNavigation } from './navigationService';
import { getProducts, getProductBySlug } from './productService';

test('site info has name and announcement', async () => {
  const site = await getSiteInfo();
  expect(site.name).toBe('Streetnut');
  expect(typeof site.announcement).toBe('string');
});

test('navigation has primary and secondary groups with labels and hrefs', async () => {
  const nav = await getNavigation();
  expect(nav.primary.length).toBeGreaterThan(0);
  expect(nav.secondary.length).toBeGreaterThan(0);
  [...nav.primary, ...nav.secondary].forEach((item) => {
    expect(item.label).toBeTruthy();
    expect(item.href).toMatch(/^\//);
  });
});

test('products load and can be found by slug', async () => {
  const products = await getProducts();
  expect(products.length).toBeGreaterThan(0);
  const first = products[0];
  expect(await getProductBySlug(first.slug)).toEqual(first);
});

test('unknown slug returns null', async () => {
  expect(await getProductBySlug('does-not-exist')).toBeNull();
});
