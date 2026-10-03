import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import Collection from './Collection';
import { getProducts } from '../services/productService';
import { getProductState } from '../utils/productState';

test('renders a card for every product from the service', async () => {
  const products = await getProducts();
  render(
    <MemoryRouter initialEntries={['/collections/all']}>
      <Routes>
        <Route path="collections/:handle" element={<Collection />} />
      </Routes>
    </MemoryRouter>
  );
  expect(await screen.findAllByRole('article')).toHaveLength(products.length);
  const soldOutCount = products.filter((p) => getProductState(p) === 'soldOut').length;
  expect(soldOutCount).toBeGreaterThan(0);
  expect(screen.getAllByText('Sold out')).toHaveLength(soldOutCount);
});

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Link to="/collections/knits">go to knits</Link>
      <Routes>
        <Route path="collections/:handle" element={<Collection />} />
      </Routes>
    </MemoryRouter>
  );

test('the tees collection shows only the 8 tee colours', async () => {
  renderAt('/collections/tees');
  expect(await screen.findAllByRole('article')).toHaveLength(8);
  expect(screen.getAllByRole('link', { name: /Fresh Foils Tee$/ })).toHaveLength(4);
  expect(screen.getAllByRole('link', { name: /High Rollers Tee$/ })).toHaveLength(4);
  expect(screen.queryByRole('link', { name: 'Nut Cap' })).toBeNull();
});

test('an unknown collection renders an empty list and does not crash', async () => {
  renderAt('/collections/knits');
  expect(await screen.findByRole('list', { name: 'Products' })).toBeInTheDocument();
  expect(screen.queryAllByRole('article')).toHaveLength(0);
});

test('moving to another collection replaces the list', async () => {
  renderAt('/collections/tees');
  expect(await screen.findAllByRole('article')).toHaveLength(8);
  await userEvent.click(screen.getByRole('link', { name: 'go to knits' }));
  await waitFor(() => expect(screen.queryAllByRole('article')).toHaveLength(0));
});
