import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuantityStepper from './QuantityStepper';

test('shows the quantity and steps down and up', async () => {
  const onChange = vi.fn();
  render(<QuantityStepper value={2} onChange={onChange} />);
  expect(screen.getByRole('textbox', { name: 'Quantity' })).toHaveValue('2');
  await userEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
  expect(onChange).toHaveBeenLastCalledWith(1);
  await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
  expect(onChange).toHaveBeenLastCalledWith(3);
});

test('decreasing from 1 asks for 0 (the bag removes the line)', async () => {
  const onChange = vi.fn();
  render(<QuantityStepper value={1} onChange={onChange} />);
  await userEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
  expect(onChange).toHaveBeenCalledWith(0);
});
