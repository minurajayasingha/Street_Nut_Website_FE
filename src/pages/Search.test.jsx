import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Search from './Search';
import { setDesktop } from '../test/viewport';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="search" element={<Search />} />
      </Routes>
    </MemoryRouter>
  );

afterEach(() => setDesktop(false));

test('shows a heading and a card for every match', async () => {
  renderAt('/search?q=foils');
  expect(await screen.findByRole('heading', { name: 'Search results for foils' })).toBeInTheDocument();
  expect(await screen.findAllByRole('article')).toHaveLength(4);
});

test('a term with no match shows the no-results line', async () => {
  renderAt('/search?q=zzzz');
  expect(await screen.findByText(/no results for/i)).toBeInTheDocument();
  expect(screen.queryAllByRole('article')).toHaveLength(0);
});

test('without a term nothing is listed and no message shows', async () => {
  renderAt('/search');
  expect(await screen.findByRole('heading', { name: /search results/i })).toBeInTheDocument();
  expect(screen.queryAllByRole('article')).toHaveLength(0);
  expect(screen.queryByText(/no results for/i)).not.toBeInTheDocument();
});

test('mobile shows the field with the term and submits a new term', async () => {
  renderAt('/search?q=foils');
  const input = screen.getByRole('searchbox');
  expect(input).toHaveValue('foils');
  expect(screen.queryByRole('button', { name: /^enter$/i })).not.toBeInTheDocument();
  await userEvent.clear(input);
  await userEvent.type(input, 'rollers');
  expect(screen.getByRole('button', { name: /^enter$/i })).toBeInTheDocument();
  await userEvent.type(input, '{Enter}');
  expect(await screen.findByRole('heading', { name: 'Search results for rollers' })).toBeInTheDocument();
});

test('desktop leaves the field to the header', () => {
  setDesktop(true);
  renderAt('/search?q=foils');
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
});
