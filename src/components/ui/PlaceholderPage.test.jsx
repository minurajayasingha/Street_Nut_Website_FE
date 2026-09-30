import { render, screen } from '@testing-library/react';
import PlaceholderPage from './PlaceholderPage';

test('renders the page name as the heading', () => {
  render(<PlaceholderPage title="Archive" />);
  expect(screen.getByRole('heading', { level: 1, name: 'Archive' })).toBeInTheDocument();
});

test('has no error tone by default', () => {
  render(<PlaceholderPage title="Archive" />);
  expect(screen.getByRole('heading', { name: 'Archive' })).not.toHaveAttribute('data-tone');
});

test('marks only the heading with the error tone', () => {
  const { container } = render(<PlaceholderPage title="Page not found" tone="error" />);
  expect(screen.getByRole('heading', { name: 'Page not found' })).toHaveAttribute('data-tone', 'error');
  expect(container.querySelectorAll('[data-tone]')).toHaveLength(1);
});
