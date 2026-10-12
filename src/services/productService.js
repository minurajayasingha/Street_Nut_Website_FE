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

const searchText = (product) =>
  [product.name, product.color, product.family?.replace(/-/g, ' ')].filter(Boolean).join(' ').toLowerCase();

// Every word of the term must appear in the product's name, colour or family.
export const searchProducts = async (term) => {
  const words = String(term ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return products
    .filter((product) => {
      const text = searchText(product);
      return words.every((word) => text.includes(word));
    })
    .map(withSizes);
};

// A size chart is { notes?, units: [{ id, label, rows }], image? }. Which garment uses which chart
// is decided by the product's `info` entry: { title: 'Size guide', sizeChart: 'tops' }.
export const getSizeChart = async (key) => (key && sizeCharts[key]) || null;
