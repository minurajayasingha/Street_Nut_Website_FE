import products from '../data/products.json';

export const getProducts = async () => products;
export const getProductBySlug = async (slug) =>
  products.find((p) => p.slug === slug) ?? null;
