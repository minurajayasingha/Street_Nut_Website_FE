import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SizeChart from './SizeChart';

const chart = {
  notes: ['Model is wearing size medium.', 'Measurements are taken flat.'],
  units: [
    {
      id: 'in',
      label: 'Inches',
      rows: [
        ['Size', 'S', 'M', 'L'],
        ['Chest', '21', '22', '23'],
        ['Front length', '28', '29', '30'],
      ],
    },
    {
      id: 'cm',
      label: 'CM',
      rows: [
        ['Size', 'S', 'M', 'L'],
        ['Chest', '53', '56', '58'],
        ['Front length', '71', '74', '76'],
      ],
    },
  ],
  image: '/size-charts/tops.svg',
  imageAlt: 'Garment diagram',
  imageSize: [240, 200],
};

test('shows the notes, the first unit as a table and the diagram', () => {
  render(<SizeChart chart={chart} />);
  expect(screen.getByText('Model is wearing size medium.')).toBeInTheDocument();
  expect(screen.getByText('Measurements are taken flat.')).toBeInTheDocument();
  const table = screen.getByRole('table', { name: 'Inches size chart' });
  expect(within(table).getAllByRole('columnheader').map((c) => c.textContent)).toEqual([
    'Size',
    'S',
    'M',
    'L',
  ]);
  expect(within(table).getByRole('rowheader', { name: 'Chest' })).toBeInTheDocument();
  expect(within(table).getByText('22')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Garment diagram' })).toHaveAttribute(
    'src',
    '/size-charts/tops.svg'
  );
});

test('the diagram reserves its space so the page does not jump when it loads', () => {
  render(<SizeChart chart={chart} />);
  const img = screen.getByRole('img', { name: 'Garment diagram' });
  expect(img).toHaveAttribute('width', '240');
  expect(img).toHaveAttribute('height', '200');
});

test('without a known size the diagram still renders', () => {
  render(<SizeChart chart={{ ...chart, imageSize: undefined }} />);
  const img = screen.getByRole('img', { name: 'Garment diagram' });
  expect(img).not.toHaveAttribute('width');
});

test('the toggle switches the unit', async () => {
  render(<SizeChart chart={chart} />);
  const inches = screen.getByRole('button', { name: 'Inches' });
  const cm = screen.getByRole('button', { name: 'CM' });
  expect(inches).toHaveAttribute('aria-pressed', 'true');
  expect(cm).toHaveAttribute('aria-pressed', 'false');
  await userEvent.click(cm);
  expect(cm).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('table', { name: 'CM size chart' })).toBeInTheDocument();
  expect(screen.getByText('56')).toBeInTheDocument();
  expect(screen.queryByText('22')).toBeNull();
});

test('the table sits in a keyboard-focusable scroll area', () => {
  render(<SizeChart chart={chart} />);
  const region = screen.getByRole('region', { name: 'Size chart' });
  expect(region).toHaveAttribute('tabindex', '0');
  expect(within(region).getByRole('table')).toBeInTheDocument();
});

test('with one unit there is no toggle', () => {
  render(<SizeChart chart={{ ...chart, units: [chart.units[0]] }} />);
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.getByRole('table')).toBeInTheDocument();
});

test('notes and image are optional', () => {
  render(<SizeChart chart={{ units: [chart.units[0]] }} />);
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.queryByRole('img')).toBeNull();
});

test('renders nothing without a usable unit', () => {
  const { container, rerender } = render(<SizeChart chart={{ units: [] }} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<SizeChart chart={{}} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<SizeChart chart={{ units: [{ id: 'in', label: 'Inches', rows: [] }] }} />);
  expect(container).toBeEmptyDOMElement();
});
