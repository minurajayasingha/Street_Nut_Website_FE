import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BagProvider, useBag } from './useBag';

const items = [
  { id: 'a:M', slug: 'a', name: 'A Tee', size: 'M', price: 45, currency: 'EUR', image: '/a.webp', quantity: 1 },
  { id: 'b:L', slug: 'b', name: 'B Tee', size: 'L', price: 19.5, currency: 'EUR', image: '/b.webp', quantity: 2 },
];
const info = { emptyMessage: 'Empty', taxNote: 'Tax', shippingNote: 'Ship' };

function Probe() {
  const bag = useBag();
  return (
    <div>
      <p data-testid="state">{`${bag.open}|${bag.count}|${bag.subtotal}|${bag.currency}|${bag.items.length}`}</p>
      <button onClick={bag.openBag}>open</button>
      <button onClick={bag.closeBag}>close</button>
      <button onClick={() => bag.setQuantity('a:M', 3)}>three</button>
      <button onClick={() => bag.setQuantity('b:L', 0)}>drop-b</button>
      <button onClick={() => bag.setQuantity('a:M', 1.5)}>fraction</button>
    </div>
  );
}
const state = () => screen.getByTestId('state').textContent;
const setup = () =>
  render(
    <BagProvider initialItems={items} initialInfo={info}>
      <Probe />
    </BagProvider>
  );

test('derives count and subtotal (price x quantity) from the lines', () => {
  setup();
  expect(state()).toBe('false|3|84|EUR|2');
});

test('open and close toggle the drawer state', async () => {
  setup();
  await userEvent.click(screen.getByText('open'));
  expect(state().startsWith('true')).toBe(true);
  await userEvent.click(screen.getByText('close'));
  expect(state().startsWith('false')).toBe(true);
});

test('setQuantity changes a line, 0 removes it, a non-integer is ignored', async () => {
  setup();
  await userEvent.click(screen.getByText('three'));
  expect(state()).toBe('false|5|174|EUR|2'); // 45 x 3 + 19.5 x 2
  await userEvent.click(screen.getByText('fraction'));
  expect(state()).toContain('|5|');
  await userEvent.click(screen.getByText('drop-b'));
  expect(state()).toBe('false|3|135|EUR|1');
});

test('useBag outside a provider returns inert defaults', async () => {
  render(<Probe />);
  expect(state()).toBe('false|0|0|USD|0');
  await userEvent.click(screen.getByText('open'));
  expect(state()).toBe('false|0|0|USD|0');
});

test('without initial props the provider loads items and info from the service', async () => {
  render(
    <BagProvider>
      <Probe />
    </BagProvider>
  );
  expect(await screen.findByText(/\|[1-9]\d*\|/)).toBeInTheDocument();
});
