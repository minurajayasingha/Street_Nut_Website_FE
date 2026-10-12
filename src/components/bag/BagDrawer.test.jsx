import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { BagProvider, useBag } from '../../hooks/useBag';
import BagDrawer from './BagDrawer';
import { formatPrice } from '../../utils/formatPrice';

const lines = [
  { id: 'a:M', slug: 'a', name: 'A Tee', size: 'M', price: 45, currency: 'EUR', image: '/a.webp', quantity: 1 },
  { id: 'b:L', slug: 'b', name: 'B Tee', size: 'L', price: 20, currency: 'EUR', image: '/b.webp', quantity: 2 },
];
const info = { emptyMessage: 'Bag is empty', taxNote: 'Tax later', shippingNote: 'Ship note' };

function Opener() {
  const { openBag } = useBag();
  return <button onClick={openBag}>Bag</button>;
}
const setup = (initialItems = lines) =>
  render(
    <MemoryRouter>
      <BagProvider initialItems={initialItems} initialInfo={info}>
        <Opener />
        <BagDrawer />
      </BagProvider>
    </MemoryRouter>
  );
const open = () => userEvent.click(screen.getByRole('button', { name: 'Bag' }));

test('is not rendered until the bag opens', async () => {
  setup();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await open();
  expect(screen.getByRole('dialog', { name: 'Shopping bag' })).toBeInTheDocument();
});

test('filled state shows the lines, the summary and a CHECKOUT button only', async () => {
  setup();
  await open();
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByRole('listitem')).toHaveLength(2);
  expect(within(dialog).getByText(formatPrice(85, 'EUR'))).toBeInTheDocument();
  expect(within(dialog).getByText('Tax later')).toBeInTheDocument();
  expect(within(dialog).getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
  expect(within(dialog).queryByRole('button', { name: 'Continue shopping' })).not.toBeInTheDocument();
});

test('empty state shows the message and a CONTINUE SHOPPING button only', async () => {
  setup([]);
  await open();
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText('Bag is empty')).toBeInTheDocument();
  expect(within(dialog).getByRole('button', { name: 'Continue shopping' })).toBeInTheDocument();
  expect(within(dialog).queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
  expect(within(dialog).queryByText('Subtotal')).not.toBeInTheDocument();
});

test('removing the last line switches to the empty state', async () => {
  setup([lines[0]]);
  await open();
  await userEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText('Bag is empty')).toBeInTheDocument();
  expect(within(dialog).getByRole('button', { name: 'Continue shopping' })).toBeInTheDocument();
  expect(within(dialog).queryByText('Subtotal')).not.toBeInTheDocument();
});

test('changing a quantity updates the subtotal', async () => {
  setup();
  await open();
  const [first] = screen.getAllByRole('button', { name: 'Increase quantity' });
  await userEvent.click(first);
  expect(screen.getByText(formatPrice(130, 'EUR'))).toBeInTheDocument();
});

test('CLOSE, the overlay, Escape and CONTINUE SHOPPING each close it', async () => {
  setup([]);
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Bag' }));
  await user.click(screen.getByRole('button', { name: 'Close' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Bag' }));
  await user.click(screen.getByTestId('bag-overlay'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Bag' }));
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Bag' }));
  await user.click(screen.getByRole('button', { name: 'Continue shopping' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('locks page scroll while open, releases it and returns focus to the opener on close', async () => {
  setup();
  const user = userEvent.setup();
  const opener = screen.getByRole('button', { name: 'Bag' });
  await user.click(opener);
  expect(document.body.style.overflow).toBe('hidden');
  expect(screen.getByRole('dialog')).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(document.body.style.overflow).toBe('');
  expect(opener).toHaveFocus();
});

test('following a line link closes the drawer', async () => {
  setup();
  await open();
  await userEvent.click(screen.getAllByRole('link', { name: 'A Tee' })[0]);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
