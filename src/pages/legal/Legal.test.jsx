import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Legal from './Legal';

const setup = () =>
  render(
    <MemoryRouter>
      <Legal />
    </MemoryRouter>
  );

test('shows three collapsed sections', async () => {
  setup();
  const buttons = await screen.findAllByRole('button');
  expect(buttons.map((b) => b.textContent)).toEqual(['Terms of Use', 'Privacy Policy', 'Personal Info']);
  buttons.forEach((b) => expect(b).toHaveAttribute('aria-expanded', 'false'));
});

test.each(['Terms of Use', 'Privacy Policy', 'Personal Info'])(
  'opening %s shows several paragraphs and a list',
  async (name) => {
    setup();
    await userEvent.click(await screen.findByRole('button', { name }));
    const panel = document.getElementById(
      screen.getByRole('button', { name }).getAttribute('aria-controls')
    );
    expect(panel.querySelectorAll('p').length).toBeGreaterThanOrEqual(3);
    expect(within(panel).getAllByRole('listitem').length).toBeGreaterThanOrEqual(2);
    expect(within(panel).getAllByText(/.+/).length).toBeGreaterThan(5);
  }
);

test('only one section is open at a time', async () => {
  setup();
  await userEvent.click(await screen.findByRole('button', { name: 'Terms of Use' }));
  await userEvent.click(screen.getByRole('button', { name: 'Privacy Policy' }));
  expect(screen.getByRole('button', { name: 'Terms of Use' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('button', { name: 'Privacy Policy' })).toHaveAttribute('aria-expanded', 'true');
});
