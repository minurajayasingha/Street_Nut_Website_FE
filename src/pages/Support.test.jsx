import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Support from './Support';

const setup = () =>
  render(
    <MemoryRouter>
      <Support />
    </MemoryRouter>
  );

test('renders the contact block', async () => {
  setup();
  expect(await screen.findByRole('heading', { level: 1, name: /contact us/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start a live chat/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /@/ })).toHaveAttribute('href', expect.stringMatching(/^mailto:/));
  expect(screen.getByText(/customer support hours/i)).toBeInTheDocument();
  expect(screen.getByText(/excluding/i).tagName).toBe('EM');
});

test('renders four social links', async () => {
  setup();
  await screen.findByRole('heading', { level: 1 });
  const social = screen.getByRole('list', { name: /social/i });
  expect(within(social).getAllByRole('link')).toHaveLength(4);
});

test('renders the FAQ heading and 24 collapsed questions', async () => {
  setup();
  expect(await screen.findByRole('heading', { level: 2, name: /frequently asked questions/i })).toBeInTheDocument();
  const questions = screen
    .getAllByRole('button')
    .filter((b) => b.hasAttribute('aria-expanded'));
  expect(questions).toHaveLength(24);
  questions.forEach((q) => expect(q).toHaveAttribute('aria-expanded', 'false'));
});

test('opening a question shows its answer and closes the previous one', async () => {
  setup();
  await screen.findByRole('heading', { level: 1 });
  const questions = screen.getAllByRole('button').filter((b) => b.hasAttribute('aria-expanded'));
  await userEvent.click(questions[0]);
  expect(questions[0]).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(questions[1]);
  expect(questions[0]).toHaveAttribute('aria-expanded', 'false');
  expect(questions[1]).toHaveAttribute('aria-expanded', 'true');
});
