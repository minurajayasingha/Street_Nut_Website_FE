import { getSiteInfo } from './siteService';
import { getNavigation } from './navigationService';
import { getProducts, getProductBySlug } from './productService';
import stock from '../data/stock.json';
import { getLegalPages, getSupportPage, getShippingReturns, getWarranty, getAccessibility, getSizeGuide } from './pageService';

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

test('legal pages each have slug, title and content blocks', async () => {
  const pages = await getLegalPages();
  expect(pages.map((p) => p.slug)).toEqual(['terms-of-use', 'privacy-policy', 'personal-info']);
  pages.forEach((page) => {
    expect(page.title).toBeTruthy();
    expect(page.blocks.length).toBeGreaterThanOrEqual(4);
    page.blocks.forEach((block) => expect(['text', 'list', 'subheading']).toContain(block.type));
  });
});

test('site info has a desktop and mobile region label', async () => {
  const site = await getSiteInfo();
  expect(site.region.label).toBe('US / $');
  expect(site.region.mobileLabel).toBe('USD / $');
});

test('support has a submenu and a support context', async () => {
  const nav = await getNavigation();
  const support = nav.secondary.find((i) => i.href === '/support');
  expect(support.children.map((c) => c.label)).toEqual([
    'Chat',
    'Shipping & Returns',
    'Size Guide',
    'Warranty',
    'Accessibility',
  ]);
  expect(support.children[0].action).toBe('chat');
  support.children.slice(1).forEach((c) => expect(c.href).toMatch(/^\/support\//));
  const ctx = nav.contexts.find((c) => c.match === '/support');
  expect(ctx.primary.map((i) => i.label)).toEqual(['New Arrivals', 'Archive', 'Chapters', 'Support']);
  expect(ctx.primary.at(-1).expanded).toBe(true);
  expect(ctx.secondary.map((i) => i.label)).toEqual(['Account', 'Newsletter', 'Legal']);
});

test('support page has contact details and 24 unique FAQ entries', async () => {
  const page = await getSupportPage();
  expect(page.contact.email).toMatch(/@/);
  expect(page.contact.social).toHaveLength(4);
  page.contact.social.forEach((s) => {
    expect(s.label).toBeTruthy();
    expect(s.href).toBeTruthy();
  });
  expect(page.faq).toHaveLength(24);
  expect(new Set(page.faq.map((f) => f.id)).size).toBe(24);
  page.faq.forEach((f) => {
    expect(f.question).toBeTruthy();
    expect(f.answer).toBeTruthy();
  });
});

test('shipping and returns has two sections with valid blocks', async () => {
  const page = await getShippingReturns();
  expect(page.title).toBe('Shipping & Returns');
  expect(page.sections.map((s) => s.title)).toEqual(['Shipping & Handling', 'Return Guidelines']);
  page.sections.forEach((section) => {
    expect(section.blocks.length).toBeGreaterThan(0);
    section.blocks.forEach((block) => {
      expect(['text', 'list', 'subheading']).toContain(block.type);
      if (block.type === 'list') expect(block.items.length).toBeGreaterThan(0);
      else expect(block.text).toBeTruthy();
    });
  });
});

test.each([
  ['warranty', getWarranty, 'Eyewear Warranty'],
  ['accessibility', getAccessibility, 'Accessibility'],
])('%s page has a title and valid blocks', async (_name, load, title) => {
  const page = await load();
  expect(page.title).toBe(title);
  expect(page.blocks.length).toBeGreaterThan(0);
  page.blocks.forEach((block) => {
    expect(['text', 'list', 'subheading']).toContain(block.type);
  });
});

test('size guide has a disclaimer and two equal-width tables', async () => {
  const page = await getSizeGuide();
  expect(page.title).toBe('Size Guide');
  const tables = page.blocks.filter((b) => b.type === 'table');
  expect(tables.map((t) => t.title)).toEqual(['International Size Conversions', 'Body Measurements']);
  tables.forEach((t) => {
    expect(t.rows.length).toBeGreaterThan(1);
    t.rows.forEach((row) => expect(row).toHaveLength(t.rows[0].length));
  });
  expect(page.blocks[0].type).toBe('text');
});

const TEE_SLUGS = [
  'fresh-foils-tee-black',
  'fresh-foils-tee-red',
  'fresh-foils-tee-rock',
  'fresh-foils-tee-white',
  'high-rollers-tee-black',
  'high-rollers-tee-rock',
  'high-rollers-tee-white',
  'high-rollers-tee-yellow',
];

test('the tees collection has the 8 colour products linked by family', async () => {
  const tees = await getProducts({ collection: 'tees' });
  expect(tees.map((p) => p.slug)).toEqual(TEE_SLUGS);
  expect([...new Set(tees.map((p) => p.family))]).toEqual(['fresh-foils-tee', 'high-rollers-tee']);
  tees.forEach((p) => {
    expect(p.name).toMatch(/^(Fresh Foils|High Rollers) Tee$/);
    expect(p.color).toBeTruthy();
    expect(p.images).toHaveLength(2);
    expect(p.images.every((src) => src.startsWith('/products/'))).toBe(true);
    expect(p.sizes.map((s) => s.label)).toEqual(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  });
});

test('stock quantities decide which sizes are available', async () => {
  const black = await getProductBySlug('fresh-foils-tee-black');
  expect(black.sizes.map((s) => [s.label, s.available])).toEqual([
    ['XS', false],
    ['S', true],
    ['M', true],
    ['L', true],
    ['XL', true],
    ['XXL', false],
  ]);
});

test('a colour with no stock in any size has every size unavailable', async () => {
  const rock = await getProductBySlug('high-rollers-tee-rock');
  expect(rock.sizes.every((s) => !s.available)).toBe(true);
});

test('every tee has a stock entry and every stock entry belongs to a product', async () => {
  TEE_SLUGS.forEach((slug) => expect(stock[slug]).toBeDefined());
  for (const slug of Object.keys(stock)) {
    expect(await getProductBySlug(slug)).not.toBeNull();
    Object.entries(stock[slug]).forEach(([label, qty]) => {
      expect(['XS', 'S', 'M', 'L', 'XL', 'XXL']).toContain(label);
      expect(Number.isInteger(qty) && qty >= 0).toBe(true);
    });
  }
});

test('the demo collection keeps one product per card state', async () => {
  const demo = await getProducts({ collection: 'demo' });
  expect(demo.map((p) => p.slug)).toEqual(['brush-logo-tee', 'street-hoodie', 'nut-cap', 'varsity-jacket']);
  expect(demo.find((p) => p.slug === 'varsity-jacket').soldOut).toBe(true);
  expect(demo.find((p) => p.slug === 'street-hoodie').badge).toBe('New');
  expect(demo.find((p) => p.slug === 'nut-cap').sizes).toEqual([{ label: 'One size', available: true }]);
});

test('collection filter: no argument and "all" return everything, an unknown handle returns nothing', async () => {
  const everything = await getProducts();
  expect(everything).toHaveLength(12);
  expect(await getProducts({ collection: 'all' })).toEqual(everything);
  expect(await getProducts({ collection: 'knits' })).toEqual([]);
});
