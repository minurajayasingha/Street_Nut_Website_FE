import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const nav = {
  primary: [{ label: 'New Arrivals', href: '/collections/new-arrivals' }],
  secondary: [{ label: 'Support', href: '/support' }],
};
const setup = (props) =>
  render(
    <MemoryRouter>
      <Header siteName="Streetnut" nav={nav} announcement="Free shipping" {...props} />
    </MemoryRouter>
  );

test('renders logo link, nav groups, search and bag', () => {
  setup();
  expect(screen.getByRole('link', { name: /streetnut/i })).toHaveAttribute('href', '/');
  expect(screen.getAllByRole('link', { name: 'New Arrivals' }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: 'Support' }).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /bag/i })).toBeInTheDocument();
});

test('renders without crashing when nav is empty', () => {
  setup({ nav: { primary: [], secondary: [] } });
  expect(screen.getByRole('banner')).toBeInTheDocument();
});

test('MENU opens the drawer and locks scroll; Escape closes it and restores scroll', async () => {
  setup();
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /^menu$/i }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(document.body.style.overflow).toBe('hidden');
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
});
