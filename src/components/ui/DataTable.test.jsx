import { render, screen, within } from '@testing-library/react';
import DataTable from './DataTable';

const rows = [
  ['Size (alpha)', 'XS', 'S', 'M'],
  ['Size (numeric)', '28', '29-30', '31-32'],
];

test('renders a table named after its title', () => {
  render(<DataTable title="Size Conversions" rows={rows} />);
  expect(screen.getByRole('table', { name: 'Size Conversions' })).toBeInTheDocument();
});

test('shows the title as the first row with empty cells to keep the columns', () => {
  render(<DataTable title="Size Conversions" rows={rows} />);
  const table = screen.getByRole('table', { name: 'Size Conversions' });
  const allRows = within(table).getAllByRole('row');
  expect(allRows).toHaveLength(3);
  expect(within(allRows[0]).getByText('Size Conversions')).toBeInTheDocument();
  expect(within(allRows[0]).getAllByRole('cell')).toHaveLength(4);
});

test('uses the first cell of each data row as its row header', () => {
  render(<DataTable title="T" rows={rows} />);
  const headers = screen.getAllByRole('rowheader');
  expect(headers.map((h) => h.textContent)).toEqual(['Size (alpha)', 'Size (numeric)']);
});

test('renders the remaining cells as data cells', () => {
  render(<DataTable title="T" rows={rows} />);
  const dataRow = screen.getAllByRole('row')[1];
  expect(within(dataRow).getAllByRole('cell').map((c) => c.textContent)).toEqual(['XS', 'S', 'M']);
});
