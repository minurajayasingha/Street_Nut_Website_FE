const ONE_SIZE = /^(one ?size|os)$/i;

export function getProductState(product) {
  const sizes = product.sizes ?? [];
  if (product.soldOut === true) return 'soldOut';
  if (sizes.length > 0 && sizes.every((size) => !size.available)) return 'soldOut';
  if (sizes.length === 0) return 'oneSize';
  if (sizes.length === 1 && ONE_SIZE.test(sizes[0].label.trim())) return 'oneSize';
  return 'default';
}
