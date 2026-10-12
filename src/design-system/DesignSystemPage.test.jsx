import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DesignSystemPage from './DesignSystemPage';
import { registry } from './registry';

const setup = () =>
  render(
    <MemoryRouter>
      <DesignSystemPage />
    </MemoryRouter>
  );

// Renders the whole registry, so it needs more than the default 5s when the suite runs in parallel
test('renders the foundations sections and every registered entry', () => {
  setup();
  expect(screen.getByRole('heading', { level: 1, name: /design system/i })).toBeInTheDocument();
  ['Colors', 'Typography', 'Tokens', 'Breakpoints'].forEach((name) => {
    expect(screen.getByRole('heading', { name })).toBeInTheDocument();
  });
  registry.forEach((entry) => {
    expect(screen.getByRole('heading', { level: 3, name: entry.name })).toBeInTheDocument();
  });
}, 30000);

test('shows tokens parsed from tokens.css', () => {
  setup();
  expect(screen.getAllByText('--font-body').length).toBeGreaterThan(0);
  expect(screen.getAllByText('--nav-left').length).toBeGreaterThan(0);
});

test('search filters components', async () => {
  setup();
  await userEvent.setup().type(screen.getByRole('searchbox'), 'accordion');
  expect(screen.getByRole('heading', { level: 3, name: 'Accordion' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { level: 3, name: 'DataTable' })).not.toBeInTheDocument();
});

test('search with no match says so instead of crashing', async () => {
  setup();
  await userEvent.setup().type(screen.getByRole('searchbox'), 'zzzzzz');
  expect(screen.getByText(/no components match/i)).toBeInTheDocument();
});
