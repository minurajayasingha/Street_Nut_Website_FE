import { getProducts } from './productService';

// UI only: the backend developer replaces these two with real bag / cart calls.
// Sample lines are built from our own products so the drawer shows real names and images.
export const getBagItems = async () => {
  const products = await getProducts({ collection: 'tees' });
  return products.slice(0, 2).map((product, index) => {
    const size = product.sizes?.find((s) => s.available)?.label;
    return {
      id: `${product.slug}:${size ?? 'one-size'}`,
      slug: product.slug,
      name: product.name,
      color: product.color,
      size,
      price: product.price,
      currency: product.currency,
      image: product.images[0],
      quantity: index + 1,
    };
  });
};

export const getBagInfo = async () => ({
  emptyMessage: 'Your bag is empty.',
  taxNote: 'Taxes and shipping are calculated at checkout.',
  shippingNote: 'Free standard shipping on orders over 150 EUR. Exclusions apply.',
});
