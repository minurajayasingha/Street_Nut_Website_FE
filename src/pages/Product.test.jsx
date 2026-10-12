import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Product from './Product';
import { getProductBySlug, getProductFamily } from '../services/productService';

vi.mock('../services/productService', () => ({
  getProductBySlug: vi.fn(),
  getProductFamily: vi.fn(),
}));

const base = {
  id: 'a-black',
  slug: 'a-black',
  family: 'a',
  name: 'A Tee',
  color: 'Black',
  price: 45,
  currency: 'EUR',
  images: ['/p/1.webp', '/p/2.webp'],
  sizes: [
    { label: 'S', available: true },
    { label: 'M', available: false },
  ],
};
const full = {
  ...base,
  badge: 'New',
  description: 'Boxy fit.',
  info: [{ title: 'Care', body: ['Wash cold'] }],
};
const minimal = { id: 'm', slug: 'm', name: 'M Tee', price: 20, currency: 'EUR', images: ['/p/m.webp'] };

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="products/:slug" element={<Product />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  getProductFamily.mockResolvedValue([]);
});

test('a complete product shows every section', async () => {
  getProductBySlug.mockResolvedValue(full);
  getProductFamily.mockResolvedValue([full, { ...base, slug: 'a-red', color: 'Red' }]);
  renderAt('/products/a-black');
  expect(await screen.findByRole('heading', { level: 1, name: 'A Tee' })).toBeInTheDocument();
  expect(screen.getByText('€45')).toBeInTheDocument();
  expect(screen.getByText('Black')).toBeInTheDocument();
  expect(screen.getByText('New')).toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'Black A Tee images' })).toBeInTheDocument();
  expect(await screen.findByRole('list', { name: 'Colours' })).toBeInTheDocument();
  expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add to bag' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Care/ })).toBeInTheDocument();
  expect(screen.getByText('Boxy fit.')).toBeInTheDocument();
});

test('a product with only name, price and one image shows no optional section', async () => {
  getProductBySlug.mockResolvedValue(minimal);
  renderAt('/products/m');
  expect(await screen.findByRole('heading', { level: 1, name: 'M Tee' })).toBeInTheDocument();
  expect(screen.getByText('€20')).toBeInTheDocument();
  expect(screen.getAllByRole('img')).toHaveLength(1);
  expect(screen.queryByRole('radiogroup')).toBeNull();
  expect(screen.queryByRole('list', { name: 'Colours' })).toBeNull();
  expect(screen.queryByText('New')).toBeNull();
  expect(screen.getAllByRole('heading')).toHaveLength(1);
  // the only button is Add to bag: no accordions
  expect(screen.getAllByRole('button')).toHaveLength(1);
});

test('a one-size product (no sizes) can be added straight away', async () => {
  getProductBySlug.mockResolvedValue(minimal);
  renderAt('/products/m');
  expect(await screen.findByRole('button', { name: 'Add to bag' })).toBeEnabled();
});

test('a product without images still renders its details', async () => {
  getProductBySlug.mockResolvedValue({ ...minimal, images: [] });
  renderAt('/products/m');
  expect(await screen.findByRole('heading', { name: 'M Tee' })).toBeInTheDocument();
  expect(screen.queryAllByRole('img')).toHaveLength(0);
});

test('an unknown slug shows the not found page', async () => {
  getProductBySlug.mockResolvedValue(null);
  renderAt('/products/nope');
  expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
});

test('a sold-out product shows SOLD OUT and no sizes or add to bag', async () => {
  getProductBySlug.mockResolvedValue({ ...base, soldOut: true });
  renderAt('/products/a-black');
  expect(await screen.findByText('Sold out')).toBeInTheDocument();
  expect(screen.queryByRole('radiogroup')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Add to bag' })).toBeNull();
});

test('add to bag stays disabled until an available size is picked', async () => {
  getProductBySlug.mockResolvedValue(base);
  renderAt('/products/a-black');
  const add = await screen.findByRole('button', { name: 'Add to bag' });
  expect(add).toBeDisabled();
  expect(screen.getByRole('radio', { name: 'M' })).toBeDisabled();
  await userEvent.click(screen.getByRole('radio', { name: 'S' }));
  expect(add).toBeEnabled();
});

test('?size= preselects an available size', async () => {
  getProductBySlug.mockResolvedValue(base);
  renderAt('/products/a-black?size=S');
  expect(await screen.findByRole('radio', { name: 'S' })).toBeChecked();
  expect(screen.getByRole('button', { name: 'Add to bag' })).toBeEnabled();
});

test.each(['M', 'XXL', ''])('?size=%s is ignored when it cannot be chosen', async (value) => {
  getProductBySlug.mockResolvedValue(base);
  renderAt(`/products/a-black?size=${value}`);
  await screen.findByRole('radiogroup', { name: 'Size' });
  screen.getAllByRole('radio').forEach((radio) => expect(radio).not.toBeChecked());
  expect(screen.getByRole('button', { name: 'Add to bag' })).toBeDisabled();
});

test('?size= is ignored on a one-size product', async () => {
  getProductBySlug.mockResolvedValue(minimal);
  renderAt('/products/m?size=S');
  expect(await screen.findByRole('button', { name: 'Add to bag' })).toBeEnabled();
  expect(screen.queryByRole('radiogroup')).toBeNull();
});

test('a family of one shows no colour switch', async () => {
  getProductBySlug.mockResolvedValue(base);
  getProductFamily.mockResolvedValue([base]);
  renderAt('/products/a-black');
  await screen.findByRole('heading', { name: 'A Tee' });
  expect(screen.queryByRole('list', { name: 'Colours' })).toBeNull();
});
