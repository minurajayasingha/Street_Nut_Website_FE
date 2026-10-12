import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BagItem from './BagItem';
import { formatPrice } from '../../utils/formatPrice';

const item = {
  id: 'a:M',
  slug: 'a-black',
  name: 'A Tee',
  color: 'Black',
  size: 'M',
  price: 45,
  currency: 'EUR',
  image: '/a.webp',
  quantity: 2,
};
const setup = (props) =>
  render(
    <MemoryRouter>
      <ul>
        <BagItem item={item} onQuantityChange={() => {}} {...props} />
      </ul>
    </MemoryRouter>
  );

test('shows name, colour / size, price, quantity and links to the product', () => {
  setup();
  expect(screen.getByRole('heading', { name: 'A Tee' })).toBeInTheDocument();
  expect(screen.getByText('Black / M')).toBeInTheDocument();
  expect(screen.getByText(formatPrice(45, 'EUR'))).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Quantity' })).toHaveValue('2');
  expect(screen.getByRole('link', { name: 'A Tee' })).toHaveAttribute('href', '/products/a-black');
  expect(screen.getByRole('img', { name: 'A Tee' })).toHaveAttribute('src', '/a.webp');
});

test('quantity buttons report the new quantity', async () => {
  const onQuantityChange = vi.fn();
  setup({ onQuantityChange });
  await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
  expect(onQuantityChange).toHaveBeenCalledWith(3);
});

test('a line without colour or size shows no stray separator or empty variant row', () => {
  const { container } = setup({ item: { ...item, color: undefined, size: undefined } });
  expect(container.textContent).not.toContain('/');
  expect(container.querySelector('[data-variant]')).toBeNull();
});

test('only one of colour or size shows without a separator', () => {
  setup({ item: { ...item, color: undefined } });
  expect(screen.getByText('M')).toBeInTheDocument();
});

test('clicking the image link calls onNavigate', async () => {
  const onNavigate = vi.fn();
  setup({ onNavigate });
  await userEvent.click(screen.getByRole('link', { name: 'A Tee' }));
  expect(onNavigate).toHaveBeenCalled();
});
