import products from '../data/products.json';
import stock from '../data/stock.json';
import sizeCharts from '../data/size-charts.json';
import { sizesFromStock } from '../utils/sizesFromStock';

// Products with a stock entry get their sizes from it; the rest keep the sizes written in products.json.
const withSizes = (product) =>
  stock[product.slug] ? { ...product, sizes: sizesFromStock(stock[product.slug]) } : product;

export const getProducts = async ({ collection } = {}) =>
  products
    .filter((p) => !collection || collection === 'all' || p.collections?.includes(collection))
    .map(withSizes);

export const getProductBySlug = async (slug) => {
  const product = products.find((p) => p.slug === slug);
  return product ? withSizes(product) : null;
};

export const getProductFamily = async (family) =>
  family ? products.filter((p) => p.family === family).map(withSizes) : [];

// A size chart is { notes?, units: [{ id, label, rows }], image? }. Which garment uses which chart
// is decided by the product's `info` entry: { title: 'Size guide', sizeChart: 'tops' }.
export const getSizeChart = async (key) => (key && sizeCharts[key]) || null;
