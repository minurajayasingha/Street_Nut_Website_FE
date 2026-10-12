import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { setDesktop } from '../../test/viewport';

function Where() {
  const { pathname, search } = useLocation();
  return <p data-testid="where">{pathname + search}</p>;
}

const setup = (props = {}) => {
  const onClose = vi.fn();
  const view = render(
    <MemoryRouter>
      <button type="button">outside</button>
      <button type="button" data-search-toggle>toggle</button>
      <SearchBar open onClose={onClose} {...props} />
      <Where />
    </MemoryRouter>
  );
  return { onClose, ...view };
};

afterEach(() => setDesktop(false));

test('renders nothing while closed', () => {
  setup({ open: false });
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
});

test('opening focuses the field and shows no results yet', () => {
  setup();
  expect(screen.getByRole('searchbox')).toHaveFocus();
  expect(screen.queryByRole('list', { name: 'Search results' })).not.toBeInTheDocument();
});

test('typing shows every matching product', async () => {
  setup();
  await userEvent.type(screen.getByRole('searchbox'), 'foils');
  expect(await screen.findAllByRole('article')).toHaveLength(4);
});

test('a term with no match shows the no-results line', async () => {
  setup();
  await userEvent.type(screen.getByRole('searchbox'), 'zzzz');
  expect(await screen.findByText(/no results for/i)).toBeInTheDocument();
});

test('a blank term shows nothing and Enter does not navigate', async () => {
  setup();
  await userEvent.type(screen.getByRole('searchbox'), '   {Enter}');
  expect(screen.queryByText(/no results for/i)).not.toBeInTheDocument();
  expect(screen.getByTestId('where')).not.toHaveTextContent('/search');
});

test('Enter goes to the results page', async () => {
  setup();
  await userEvent.type(screen.getByRole('searchbox'), 'tee{Enter}');
  expect(screen.getByTestId('where')).toHaveTextContent('/search?q=tee');
});

test('a slow earlier lookup never overwrites the newest results', async () => {
  setup();
  const input = screen.getByRole('searchbox');
  await userEvent.type(input, 'foils');
  await userEvent.clear(input);
  await userEvent.type(input, 'rollers');
  await waitFor(() => {
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((a) => expect(a.textContent).toMatch(/high rollers/i));
  });
  expect(screen.queryByRole('link', { name: /fresh foils/i })).not.toBeInTheDocument();
});

test('ESC on mobile clears the term and closes', async () => {
  const { onClose } = setup();
  await userEvent.type(screen.getByRole('searchbox'), 'tee');
  await userEvent.keyboard('{Escape}');
  expect(screen.getByRole('searchbox')).toHaveValue('');
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('ESC on desktop clears the term and keeps search open', async () => {
  setDesktop(true);
  const { onClose } = setup();
  await userEvent.type(screen.getByRole('searchbox'), 'tee');
  await userEvent.keyboard('{Escape}');
  expect(screen.getByRole('searchbox')).toHaveValue('');
  expect(onClose).not.toHaveBeenCalled();
});

test('clicking outside closes; clicking inside or on the toggle does not', async () => {
  const { onClose } = setup();
  await userEvent.click(screen.getByRole('searchbox'));
  await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
  expect(onClose).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'outside' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('locks body scroll while open and releases it when closed', () => {
  const { unmount } = setup();
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).toBe('');
});

test('closing and reopening gives an empty field and no old results', async () => {
  const ui = (open) => (
    <MemoryRouter>
      <SearchBar open={open} onClose={() => {}} />
    </MemoryRouter>
  );
  const { rerender } = render(ui(true));
  await userEvent.type(screen.getByRole('searchbox'), 'foils');
  expect(await screen.findAllByRole('article')).toHaveLength(4);
  rerender(ui(false));
  rerender(ui(true));
  expect(screen.getByRole('searchbox')).toHaveValue('');
  expect(screen.queryAllByRole('article')).toHaveLength(0);
});

test('crossing 1025px keeps the open state and the typed term', async () => {
  setup();
  await userEvent.type(screen.getByRole('searchbox'), 'tee');
  setDesktop(true);
  expect(screen.getByRole('searchbox')).toHaveValue('tee');
  expect(screen.getByRole('link', { name: /view all results/i })).toBeInTheDocument();
});

test('mobile shows ENTER and desktop shows VIEW ALL RESULTS and CLEAR', async () => {
  setup();
  await userEvent.type(screen.getByRole('searchbox'), 'tee');
  expect(screen.getByRole('button', { name: /^enter$/i })).toBeInTheDocument();
  setDesktop(true);
  expect(screen.getByRole('button', { name: /^clear$/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^enter$/i })).not.toBeInTheDocument();
});

test('persistent desktop shows the field with the term but no panel until it is edited', async () => {
  setDesktop(true);
  setup({ open: false, persistent: true, initialTerm: 'tee' });
  const input = screen.getByRole('searchbox');
  expect(input).toHaveValue('tee');
  expect(screen.queryByRole('list', { name: 'Search results' })).not.toBeInTheDocument();
  await userEvent.type(input, 'x');
  expect(await screen.findByText(/no results for/i)).toBeInTheDocument();
});

test('persistent search on mobile renders nothing while closed', () => {
  setup({ open: false, persistent: true, initialTerm: 'tee' });
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
});

test('the unedited results page shows CLEAR but not VIEW ALL RESULTS', async () => {
  setDesktop(true);
  setup({ open: false, persistent: true, initialTerm: 'tee' });
  expect(screen.getByRole('button', { name: /^clear$/i })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /view all results/i })).not.toBeInTheDocument();
  await userEvent.type(screen.getByRole('searchbox'), 'x');
  expect(screen.getByRole('link', { name: /view all results/i })).toBeInTheDocument();
});
