import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';

const items = [{ id: 'a', slug: 'a', name: 'Alpha', price: 10, currency: 'USD', images: ['/a.svg'] }];
const setup = (props) =>
  render(
    <MemoryRouter>
      <SearchResults term="alpha" items={[]} settled {...props} />
    </MemoryRouter>
  );

test('shows a product card for every item', () => {
  setup({ items });
  expect(screen.getByRole('list', { name: 'Search results' })).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(1);
});

test('shows the no-results line when the lookup settled with nothing', () => {
  setup({ term: 'zzzz' });
  expect(screen.getByText(/no results for/i)).toHaveTextContent('zzzz');
});

test('shows nothing while the lookup has not settled', () => {
  setup({ settled: false });
  expect(screen.queryByText(/no results for/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

test('shows nothing without a term', () => {
  setup({ term: '' });
  expect(screen.queryByText(/no results for/i)).not.toBeInTheDocument();
});

test('the no-results line can be centred in a panel', () => {
  setup({ term: 'zzzz', centered: true });
  expect(screen.getByText(/no results for/i).className).toMatch(/centered/);
});

test('the no-results line is not panel-centred by default', () => {
  setup({ term: 'zzzz' });
  expect(screen.getByText(/no results for/i).className).not.toMatch(/centered/);
});
