import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

const base = {
  id: 'p1',
  slug: 'brush-logo-tee',
  name: 'Brush Logo Tee',
  price: 45,
  currency: 'EUR',
  images: ['/a.svg', '/b.svg'],
  sizes: [
    { label: 'S', available: true },
    { label: 'M', available: false },
  ],
};

const setup = (overrides = {}) =>
  render(
    <MemoryRouter>
      <ProductCard product={{ ...base, ...overrides }} />
    </MemoryRouter>
  );

const imgs = (container) => container.querySelectorAll('img');

test('shows the name as a link to the product, and the price', () => {
  setup();
  expect(screen.getByRole('link', { name: 'Brush Logo Tee' })).toHaveAttribute(
    'href',
    '/products/brush-logo-tee'
  );
  expect(screen.getByText('€45')).toBeInTheDocument();
  expect(screen.getByRole('article')).toHaveAttribute('data-state', 'default');
});

test('renders the featured image and the second image when there is one', () => {
  const { container } = setup();
  expect(imgs(container)).toHaveLength(2);
  expect(imgs(container)[0]).toHaveAttribute('src', '/a.svg');
  expect(imgs(container)[0]).toHaveAttribute('alt', 'Brush Logo Tee');
  expect(imgs(container)[1]).toHaveAttribute('src', '/b.svg');
});

test('renders one image when the product has only one', () => {
  const { container } = setup({ images: ['/a.svg'] });
  expect(imgs(container)).toHaveLength(1);
});

test('falls back to the legacy image field', () => {
  const { container } = setup({ images: undefined, image: '/legacy.svg' });
  expect(imgs(container)[0]).toHaveAttribute('src', '/legacy.svg');
});

test('with no images at all it still renders the text and no img', () => {
  const { container } = setup({ images: [], image: undefined });
  expect(imgs(container)).toHaveLength(0);
  expect(screen.getByRole('link', { name: 'Brush Logo Tee' })).toBeInTheDocument();
});

test('lists sizes: available ones link, unavailable ones are disabled', () => {
  setup();
  expect(screen.getByRole('link', { name: 'View Brush Logo Tee, size S' })).toBeInTheDocument();
  expect(screen.getByText('M')).toHaveAttribute('aria-disabled', 'true');
});

test('one-size products keep the reserved row but list no sizes', () => {
  setup({ sizes: [{ label: 'One size', available: true }] });
  expect(screen.getByRole('article')).toHaveAttribute('data-state', 'oneSize');
  expect(screen.getByTestId('size-row')).toBeInTheDocument();
  expect(screen.queryByRole('list')).toBeNull();
  expect(screen.getByText('€45')).toBeInTheDocument();
});

test('sold-out products show SOLD OUT instead of the price and no sizes', () => {
  setup({ soldOut: true });
  expect(screen.getByRole('article')).toHaveAttribute('data-state', 'soldOut');
  expect(screen.getByText('Sold out')).toBeInTheDocument();
  expect(screen.queryByText('€45')).toBeNull();
  expect(screen.queryByTestId('size-row')).toBeNull();
  expect(screen.getByRole('link', { name: 'Brush Logo Tee' })).toBeInTheDocument();
});

test('a product whose sizes are all unavailable is sold out', () => {
  setup({ sizes: [{ label: 'S', available: false }] });
  expect(screen.getByText('Sold out')).toBeInTheDocument();
});

test('shows the badge when there is one', () => {
  setup({ badge: 'New' });
  expect(screen.getByText('New')).toBeInTheDocument();
});

test('shows a colour count when there is no badge and more than one colour', () => {
  setup({ colors: 3 });
  expect(screen.getByText('3 colours')).toBeInTheDocument();
});

test('a single colour shows nothing', () => {
  setup({ colors: 1 });
  expect(screen.queryByText(/colour/i)).toBeNull();
});

test('the badge wins over the colour count', () => {
  setup({ badge: 'New', colors: 3 });
  expect(screen.getByText('New')).toBeInTheDocument();
  expect(screen.queryByText('3 colours')).toBeNull();
});

test('a missing price renders no price text', () => {
  setup({ price: undefined });
  expect(screen.queryByText(/NaN|undefined/)).toBeNull();
  expect(screen.queryByText(/€/)).toBeNull();
});

test('the scroll track is not a keyboard stop', () => {
  const { container } = setup();
  expect(container.querySelector('a[aria-hidden="true"] > span')).toHaveAttribute('tabindex', '-1');
});

test('a null currency renders the price in the default currency', () => {
  setup({ currency: null, price: 45 });
  expect(screen.getByText('$45')).toBeInTheDocument();
});
