import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Collection from './Collection';
import { getProducts } from '../services/productService';

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
  expect(screen.getByText('Sold out')).toBeInTheDocument();
});
