import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchField from './SearchField';

const setup = (props) => {
  const handlers = { onChange: vi.fn(), onSubmit: vi.fn(), onClear: vi.fn() };
  render(
    <MemoryRouter>
      <SearchField variant="strip" value="" {...handlers} {...props} />
    </MemoryRouter>
  );
  return handlers;
};

test('has a labelled search input with the SEARCH HERE placeholder', () => {
  setup();
  const input = screen.getByRole('searchbox', { name: 'Search' });
  expect(input).toHaveAttribute('placeholder', 'Search here');
});

test('typing reports the new value', async () => {
  const { onChange } = setup();
  await userEvent.type(screen.getByRole('searchbox'), 'a');
  expect(onChange).toHaveBeenCalledWith('a');
});

test('Enter submits the trimmed term', async () => {
  const { onSubmit } = setup({ value: '  tee ' });
  await userEvent.type(screen.getByRole('searchbox'), '{Enter}');
  expect(onSubmit).toHaveBeenCalledWith('tee');
});

test('a blank term is not submitted', async () => {
  const { onSubmit } = setup({ value: '   ' });
  await userEvent.type(screen.getByRole('searchbox'), '{Enter}');
  expect(onSubmit).not.toHaveBeenCalled();
});

test('strip shows no ENTER button while the field is empty', () => {
  setup();
  expect(screen.queryByRole('button', { name: /^enter$/i })).not.toBeInTheDocument();
});

test('strip ENTER button submits the term', async () => {
  const { onSubmit } = setup({ value: 'tee' });
  await userEvent.click(screen.getByRole('button', { name: /^enter$/i }));
  expect(onSubmit).toHaveBeenCalledWith('tee');
});

test('strip can hide ENTER', () => {
  setup({ value: 'tee', showEnter: false });
  expect(screen.queryByRole('button', { name: /^enter$/i })).not.toBeInTheDocument();
});

test('bar shows VIEW ALL RESULTS and CLEAR once there is a term', async () => {
  const { onClear } = setup({ variant: 'bar', value: 'foils' });
  expect(screen.getByRole('link', { name: /view all results/i })).toHaveAttribute('href', '/search?q=foils');
  await userEvent.click(screen.getByRole('button', { name: /^clear$/i }));
  expect(onClear).toHaveBeenCalled();
});

test('bar shows neither action while the field is empty', () => {
  setup({ variant: 'bar' });
  expect(screen.queryByRole('link', { name: /view all results/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^clear$/i })).not.toBeInTheDocument();
});

test('bar can hide VIEW ALL RESULTS and keeps CLEAR', () => {
  setup({ variant: 'bar', value: 'foils', showViewAll: false });
  expect(screen.queryByRole('link', { name: /view all results/i })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^clear$/i })).toBeInTheDocument();
});
