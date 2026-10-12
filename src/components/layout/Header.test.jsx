import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { BagProvider } from '../../hooks/useBag';

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

test('the nav link for the current page is marked as current', () => {
  render(
    <MemoryRouter initialEntries={['/support']}>
      <Header siteName="Streetnut" nav={nav} announcement="Free shipping" />
    </MemoryRouter>
  );
  const [desktopLink] = screen.getAllByRole('link', { name: 'Support' });
  expect(desktopLink).toHaveAttribute('aria-current', 'page');
  expect(screen.getAllByRole('link', { name: 'New Arrivals' })[0]).not.toHaveAttribute('aria-current');
});

test('hiding the announcement leaves the nav, search and bag in place', async () => {
  setup();
  await userEvent.setup().click(screen.getByRole('button', { name: /^hide$/i }));
  expect(screen.queryByRole('region', { name: /announcement/i })).not.toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: 'New Arrivals' }).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /bag/i })).toBeInTheDocument();
});

const region = { label: 'US / $', mobileLabel: 'USD / $' };

test('shows the region row under the desktop nav', () => {
  setup({ region });
  expect(screen.getByRole('button', { name: 'US / $' })).toBeInTheDocument();
});

test('drawer shows the mobile region label', async () => {
  setup({ region });
  await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
  expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'USD / $' })).toBeInTheDocument();
});

test('the header button switches MENU to CLOSE and closes the drawer', async () => {
  setup();
  await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
  expect(screen.queryByRole('button', { name: /^menu$/i })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /^close$/i }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^menu$/i })).toBeInTheDocument();
});

test('the drawer has only one close button and keeps the header search and bag visible', async () => {
  setup();
  await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
  expect(screen.getAllByRole('button', { name: /^close$/i })).toHaveLength(1);
  expect(within(screen.getByRole('dialog')).queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
});

const supportNav = {
  primary: [{ label: 'Tees', href: '/collections/tees' }],
  secondary: [
    {
      label: 'Support',
      href: '/support',
      children: [
        { label: 'Chat', action: 'chat' },
        { label: 'Size Guide', href: '/support/size-guide' },
      ],
    },
    { label: 'Legal', href: '/legal' },
  ],
  contexts: [
    {
      match: '/support',
      primary: [
        { label: 'Archive', href: '/archive' },
        {
          label: 'Support',
          href: '/support',
          expanded: true,
          children: [
            { label: 'Chat', action: 'chat' },
            { label: 'Size Guide', href: '/support/size-guide' },
          ],
        },
      ],
      secondary: [{ label: 'Legal', href: '/legal' }],
    },
  ],
};
const setupAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Header siteName="Streetnut" nav={supportNav} announcement="x" />
    </MemoryRouter>
  );

test('desktop nav shows the normal lists outside the support section', () => {
  setupAt('/legal');
  const main = screen.getByRole('navigation', { name: 'Main' });
  expect(within(main).getByRole('link', { name: 'Tees' })).toBeInTheDocument();
  expect(within(main).queryByRole('button', { name: 'Chat' })).not.toBeInTheDocument();
});

test('desktop nav swaps to the support context with its children inside the section', () => {
  setupAt('/support/size-guide');
  const main = screen.getByRole('navigation', { name: 'Main' });
  expect(within(main).queryByRole('link', { name: 'Tees' })).not.toBeInTheDocument();
  expect(within(main).getByRole('button', { name: 'Chat' })).toBeInTheDocument();
  expect(within(main).getByRole('link', { name: 'Size Guide' })).toHaveAttribute('aria-current', 'page');
  expect(within(main).getByRole('link', { name: 'Support' })).toHaveAttribute('href', '/support');
});

test('drawer expands the support submenu in place', async () => {
  setupAt('/legal');
  await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
  const dialog = screen.getByRole('dialog');
  const toggle = within(dialog).getByRole('button', { name: 'Support' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(within(dialog).queryByRole('link', { name: 'Size Guide' })).not.toBeInTheDocument();
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(within(dialog).getByRole('link', { name: 'Size Guide' })).toHaveAttribute('href', '/support/size-guide');
  expect(within(dialog).getByRole('button', { name: 'Chat' })).toBeInTheDocument();
  await userEvent.click(toggle);
  expect(within(dialog).queryByRole('link', { name: 'Size Guide' })).not.toBeInTheDocument();
});

test('drawer parent with children is a toggle button, not a link', async () => {
  setupAt('/legal');
  await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).queryByRole('link', { name: 'Support' })).not.toBeInTheDocument();
});

const sampleLine = {
  id: 'a:M',
  slug: 'a',
  name: 'A Tee',
  price: 45,
  currency: 'EUR',
  image: '/a.webp',
  quantity: 2,
};
const withBag = (items) =>
  render(
    <MemoryRouter>
      <BagProvider initialItems={items} initialInfo={{}}>
        <Header siteName="Streetnut" nav={nav} announcement="x" />
      </BagProvider>
    </MemoryRouter>
  );

test('BAG shows the item count only when the bag has items', () => {
  withBag([sampleLine]);
  expect(screen.getByRole('button', { name: 'Bag (2)' })).toBeInTheDocument();
});

test('BAG shows no count for an empty bag', () => {
  withBag([]);
  expect(screen.getByRole('button', { name: 'Bag' })).toBeInTheDocument();
});
