import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductGrid from './ProductGrid';

const products = [
  { id: 'a', slug: 'a', name: 'Alpha', price: 10, currency: 'USD', images: ['/a.svg'] },
  { id: 'b', slug: 'b', name: 'Beta', price: 20, currency: 'USD', images: ['/b.svg'] },
];

const setup = (props) =>
  render(
    <MemoryRouter>
      <ProductGrid {...props} />
    </MemoryRouter>
  );

test('renders one card per product inside a labelled list', () => {
  setup({ products });
  const list = screen.getByRole('list', { name: 'Products' });
  expect(list.children).toHaveLength(2);
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByRole('link', { name: 'Alpha' })).toBeInTheDocument();
});

test('the list label can be changed', () => {
  setup({ products, label: 'Tees' });
  expect(screen.getByRole('list', { name: 'Tees' })).toBeInTheDocument();
});

test('an empty or missing product list renders an empty list', () => {
  setup({});
  expect(screen.getByRole('list', { name: 'Products' }).children).toHaveLength(0);
});
