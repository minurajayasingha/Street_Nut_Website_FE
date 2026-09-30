import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

test('home route renders', () => {
  renderAt('/');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
});

test('unknown route renders NotFound inside layout', () => {
  renderAt('/nope/nothing');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument();
});
