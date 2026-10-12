import { render, screen } from '@testing-library/react';
import BagEmpty from './BagEmpty';

test('shows the message and the shipping note', () => {
  render(<BagEmpty message="Your bag is empty." shippingNote="Ships in 2 days" />);
  expect(screen.getByText('Your bag is empty.')).toBeInTheDocument();
  expect(screen.getByText('Ships in 2 days')).toBeInTheDocument();
});

test('renders nothing visible without text', () => {
  const { container } = render(<BagEmpty />);
  expect(container.textContent).toBe('');
});
