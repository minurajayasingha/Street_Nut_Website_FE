import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TextPage from './TextPage';

const page = {
  title: 'Sample Text',
  blocks: [
    { type: 'text', text: '**Lead**\nFirst paragraph with [a link](/legal)' },
    { type: 'text', text: 'Second paragraph' },
  ],
};

const setup = () =>
  render(
    <MemoryRouter>
      <TextPage page={page} />
    </MemoryRouter>
  );

test('shows the title as the visible page heading', () => {
  setup();
  const h1 = screen.getByRole('heading', { level: 1, name: 'Sample Text' });
  expect(h1).toBeInTheDocument();
  expect(h1.className).not.toMatch(/srOnly/);
});

test('renders its text blocks with rich text', () => {
  setup();
  expect(screen.getByText('Lead').tagName).toBe('STRONG');
  expect(screen.getByRole('link', { name: 'a link' })).toHaveAttribute('href', '/legal');
  expect(screen.getByText('Second paragraph')).toBeInTheDocument();
});

test('renders table blocks', () => {
  render(
    <MemoryRouter>
      <TextPage
        page={{
          title: 'With Table',
          blocks: [{ type: 'table', title: 'Sizes', rows: [['A', '1', '2']] }],
        }}
      />
    </MemoryRouter>
  );
  expect(screen.getByRole('table', { name: 'Sizes' })).toBeInTheDocument();
});
