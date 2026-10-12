import { render, screen } from '@testing-library/react';
import BagSummary from './BagSummary';
import { formatPrice } from '../../utils/formatPrice';

test('shows the notes and a subtotal row', () => {
  render(<BagSummary subtotal={90} currency="EUR" taxNote="Tax later" shippingNote="Free over 150" />);
  expect(screen.getByText('Tax later')).toBeInTheDocument();
  expect(screen.getByText('Free over 150')).toBeInTheDocument();
  expect(screen.getByText('Subtotal')).toBeInTheDocument();
  expect(screen.getByText(formatPrice(90, 'EUR'))).toBeInTheDocument();
});

test('a fractional subtotal keeps two decimals', () => {
  render(<BagSummary subtotal={19.5} currency="EUR" />);
  expect(screen.getByText(formatPrice(19.5, 'EUR'))).toBeInTheDocument();
  expect(formatPrice(19.5, 'EUR')).toMatch(/19\.50$/);
});

test('missing notes leave no empty paragraphs', () => {
  const { container } = render(<BagSummary subtotal={10} currency="EUR" />);
  expect(container.querySelectorAll('p')).toHaveLength(2); // Subtotal label + amount
});
