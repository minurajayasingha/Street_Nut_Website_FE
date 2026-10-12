import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accordion from './Accordion';

const items = [
  { id: 'a', title: 'First', content: 'First body' },
  { id: 'b', title: 'Second', content: 'Second body' },
];

test('renders all items collapsed', () => {
  render(<Accordion items={items} />);
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByText('First body')).not.toBeInTheDocument();
});

test('clicking a header opens its content', async () => {
  render(<Accordion items={items} />);
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('First body')).toBeInTheDocument();
});

test('opening another item closes the first', async () => {
  render(<Accordion items={items} />);
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  await userEvent.click(screen.getByRole('button', { name: 'Second' }));
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByText('First body')).not.toBeInTheDocument();
  expect(screen.getByText('Second body')).toBeInTheDocument();
});

test('clicking an open header closes it', async () => {
  render(<Accordion items={items} />);
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  expect(screen.queryByText('First body')).not.toBeInTheDocument();
});

test('onChange reports the open id, then null when it closes', async () => {
  const onChange = vi.fn();
  render(<Accordion items={items} onChange={onChange} />);
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  expect(onChange).toHaveBeenLastCalledWith('a');
  await userEvent.click(screen.getByRole('button', { name: 'Second' }));
  expect(onChange).toHaveBeenLastCalledWith('b');
  await userEvent.click(screen.getByRole('button', { name: 'Second' }));
  expect(onChange).toHaveBeenLastCalledWith(null);
});
