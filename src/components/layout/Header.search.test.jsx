import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { setDesktop } from '../../test/viewport';

const nav = {
  primary: [{ label: 'New Arrivals', href: '/collections/new-arrivals' }],
  secondary: [{ label: 'Support', href: '/support' }],
};
const setup = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Header siteName="Streetnut" nav={nav} announcement="Free shipping" />
    </MemoryRouter>
  );

afterEach(() => setDesktop(false));

test('SEARCH opens the field and the button becomes CLOSE', async () => {
  setup();
  const toggle = screen.getByRole('button', { name: /^search$/i });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(toggle);
  expect(screen.getByRole('searchbox')).toHaveFocus();
  expect(screen.getByRole('button', { name: /^close$/i })).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(screen.getByRole('button', { name: /^close$/i }));
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
});

test('clicking outside the open search closes it', async () => {
  setup();
  await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
  await userEvent.click(screen.getByRole('button', { name: /^bag/i }));
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
});

test('opening search closes the menu drawer, and opening the menu closes search', async () => {
  setup();
  await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('searchbox')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('submitting a term leaves the page and closes search', async () => {
  setup();
  await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
  await userEvent.type(screen.getByRole('searchbox'), 'tee{Enter}');
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
});

test('on desktop at /search the field shows the term and the button stays SEARCH', async () => {
  setDesktop(true);
  setup('/search?q=tee');
  expect(screen.getByRole('searchbox')).toHaveValue('tee');
  await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
  expect(screen.getByRole('searchbox')).toHaveFocus();
});

test('the announcement is hidden while search is open and comes back when it closes', async () => {
  setup();
  expect(screen.getByRole('region', { name: /announcement/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
  expect(screen.queryByRole('region', { name: /announcement/i })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /^close$/i }));
  expect(screen.getByRole('region', { name: /announcement/i })).toBeInTheDocument();
});

test('clicking in the field keeps search open', async () => {
  setup();
  await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
  await userEvent.click(screen.getByRole('searchbox'));
  expect(screen.getByRole('searchbox')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^close$/i })).toBeInTheDocument();
});

test('the announcement stays hidden on the desktop results page', () => {
  setDesktop(true);
  setup('/search?q=tee');
  expect(screen.queryByRole('region', { name: /announcement/i })).not.toBeInTheDocument();
});
