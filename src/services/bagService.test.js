import { getBagItems, getBagInfo } from './bagService';

test('getBagItems returns sample lines with everything a line needs', async () => {
  const items = await getBagItems();
  expect(items.length).toBeGreaterThan(0);
  items.forEach((item) => {
    expect(item.id).toBeTruthy();
    expect(item.slug).toBeTruthy();
    expect(item.name).toBeTruthy();
    expect(typeof item.price).toBe('number');
    expect(item.currency).toBeTruthy();
    expect(typeof item.image).toBe('string');
    expect(item.quantity).toBeGreaterThanOrEqual(1);
  });
  expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
});

test('getBagInfo returns the three messages', async () => {
  const info = await getBagInfo();
  expect(info.emptyMessage).toBeTruthy();
  expect(info.taxNote).toBeTruthy();
  expect(info.shippingNote).toBeTruthy();
});
