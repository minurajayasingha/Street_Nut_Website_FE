import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SizePicker from './SizePicker';

const sizes = [
  { label: 'XS', available: false },
  { label: 'S', available: true },
  { label: 'M', available: true },
];

test('lists every size as a radio, unavailable ones disabled', () => {
  render(<SizePicker sizes={sizes} value={null} onChange={() => {}} />);
  expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
  expect(screen.getAllByRole('radio')).toHaveLength(3);
  expect(screen.getByRole('radio', { name: 'XS' })).toBeDisabled();
  expect(screen.getByRole('radio', { name: 'S' })).toBeEnabled();
});

test('marks the selected size', () => {
  render(<SizePicker sizes={sizes} value="M" onChange={() => {}} />);
  expect(screen.getByRole('radio', { name: 'M' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'S' })).not.toBeChecked();
});

test('picking a size calls onChange with its label', async () => {
  const onChange = vi.fn();
  render(<SizePicker sizes={sizes} value={null} onChange={onChange} />);
  await userEvent.click(screen.getByRole('radio', { name: 'S' }));
  expect(onChange).toHaveBeenCalledWith('S');
});

test('an unavailable size cannot be picked', async () => {
  const onChange = vi.fn();
  render(<SizePicker sizes={sizes} value={null} onChange={onChange} />);
  await userEvent.click(screen.getByRole('radio', { name: 'XS' }));
  expect(onChange).not.toHaveBeenCalled();
});

test('renders nothing without sizes', () => {
  const { container, rerender } = render(<SizePicker sizes={[]} value={null} onChange={() => {}} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<SizePicker value={null} onChange={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});
