import { getSiteInfo } from './siteService';
import { getNavigation } from './navigationService';
import { getProducts, getProductBySlug } from './productService';
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

test('products expose images, sizes and the card state flags', async () => {
  const products = await getProducts();
  expect(products.map((p) => p.slug)).toEqual([
    'brush-logo-tee',
    'street-hoodie',
    'nut-cap',
    'varsity-jacket',
  ]);
  products.forEach((p) => {
    expect(p.images.length).toBeGreaterThan(0);
    expect(Array.isArray(p.sizes)).toBe(true);
    p.sizes.forEach((s) => {
      expect(s.label).toBeTruthy();
      expect(typeof s.available).toBe('boolean');
    });
  });
  expect(products.find((p) => p.slug === 'varsity-jacket').soldOut).toBe(true);
  expect(products.find((p) => p.slug === 'street-hoodie').badge).toBe('New');
});
