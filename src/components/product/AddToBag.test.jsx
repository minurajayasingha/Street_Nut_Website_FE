import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddToBag from './AddToBag';

test('is a button labelled Add to bag', () => {
  render(<AddToBag />);
  expect(screen.getByRole('button', { name: 'Add to bag' })).toBeEnabled();
});

test('can be disabled', () => {
  render(<AddToBag disabled />);
  expect(screen.getByRole('button', { name: 'Add to bag' })).toBeDisabled();
});

test('calls onClick when enabled and does not crash without one', async () => {
  const onClick = vi.fn();
  const { rerender } = render(<AddToBag onClick={onClick} />);
  await userEvent.click(screen.getByRole('button', { name: 'Add to bag' }));
  expect(onClick).toHaveBeenCalledTimes(1);
  rerender(<AddToBag />);
  await userEvent.click(screen.getByRole('button', { name: 'Add to bag' }));
});
