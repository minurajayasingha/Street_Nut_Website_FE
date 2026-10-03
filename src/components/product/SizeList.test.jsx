import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SizeList from './SizeList';

const sizes = [
  { label: 'XS', available: false },
  { label: 'S', available: true },
  { label: 'M', available: true },
];

const setup = (props) =>
  render(
    <MemoryRouter>
      <SizeList slug="brush-logo-tee" name="Brush Logo Tee" sizes={sizes} {...props} />
    </MemoryRouter>
  );

test('available sizes link to the product with the size selected', () => {
  setup();
  const link = screen.getByRole('link', { name: 'View Brush Logo Tee, size S' });
  expect(link).toHaveAttribute('href', '/products/brush-logo-tee?size=S');
  expect(link).toHaveTextContent('S');
});

test('unavailable sizes are disabled text, not links', () => {
  setup();
  const xs = screen.getByText('XS');
  expect(xs).toHaveAttribute('aria-disabled', 'true');
  expect(xs.closest('a')).toBeNull();
  expect(screen.getAllByRole('link')).toHaveLength(2);
});

test('size labels are URL encoded', () => {
  setup({ sizes: [{ label: 'W 30/32', available: true }] });
  expect(screen.getByRole('link')).toHaveAttribute(
    'href',
    '/products/brush-logo-tee?size=W%2030%2F32'
  );
});

test('with no sizes the reserved row stays but nothing is listed', () => {
  setup({ sizes: [] });
  expect(screen.getByTestId('size-row')).toBeInTheDocument();
  expect(screen.queryByRole('list')).toBeNull();
});
