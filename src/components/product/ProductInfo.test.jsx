import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductInfo from './ProductInfo';

const info = [
  { title: 'Care', body: ['Wash cold', 'Do not tumble dry'] },
  { title: 'Fit', body: 'Boxy fit' },
];

test('shows one accordion per info entry and the description', async () => {
  render(<ProductInfo product={{ description: 'Free shipping over 100.', info }} />);
  expect(screen.getByRole('button', { name: /Care/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Fit/ })).toBeInTheDocument();
  expect(screen.getByText('Free shipping over 100.')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /Care/ }));
  expect(screen.getByText('Wash cold')).toBeInTheDocument();
  expect(screen.getByText('Do not tumble dry')).toBeInTheDocument();
});

test('with only a description there are no accordions', () => {
  render(<ProductInfo product={{ description: 'Just a note.' }} />);
  expect(screen.getByText('Just a note.')).toBeInTheDocument();
  expect(screen.queryAllByRole('button')).toHaveLength(0);
});

test('with only info there is no description paragraph', () => {
  const { container } = render(<ProductInfo product={{ info }} />);
  expect(screen.getAllByRole('button')).toHaveLength(2);
  expect(container.querySelector('p')).toBeNull();
});

test('entries without text are skipped, no empty accordion', () => {
  render(
    <ProductInfo
      product={{
        info: [
          { title: 'Care', body: '  ' },
          { title: 'Fit', body: 'Boxy fit' },
        ],
      }}
    />
  );
  expect(screen.getAllByRole('button')).toHaveLength(1);
  expect(screen.queryByRole('button', { name: /Care/ })).toBeNull();
});

test('renders nothing when there is nothing to show', () => {
  const { container, rerender } = render(<ProductInfo product={{}} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductInfo product={{ description: '   ', info: [] }} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductInfo product={{ info: [{ title: 'Care', body: [''] }] }} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductInfo product={{ info: 'not a list' }} />);
  expect(container).toBeEmptyDOMElement();
});
