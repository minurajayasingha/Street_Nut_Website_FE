export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function sizesFromStock(levels = {}) {
  return SIZE_ORDER.map((label) => ({ label, available: Number(levels[label]) > 0 }));
}
