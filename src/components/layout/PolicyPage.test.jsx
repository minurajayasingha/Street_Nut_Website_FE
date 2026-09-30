import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PolicyPage from './PolicyPage';

const page = {
  title: 'Sample Policy',
  sections: [
    {
      id: 'one',
      title: 'Section One',
      blocks: [
        { type: 'text', text: '**Lead**\nBody line' },
        { type: 'list', items: ['First item', 'Second [link](/legal)'] },
        { type: 'subheading', text: 'A sub heading' },
        { type: 'text', text: 'Closing text' },
      ],
    },
    { id: 'two', title: 'Section Two', blocks: [{ type: 'text', text: 'Only text' }] },
  ],
};

const setup = () =>
  render(
    <MemoryRouter>
      <PolicyPage page={page} />
    </MemoryRouter>
  );

test('renders a page heading plus a title per section', () => {
  setup();
  expect(screen.getByRole('heading', { level: 1, name: 'Sample Policy' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Section One' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Section Two' })).toBeInTheDocument();
});

test('renders text blocks, lists and sub headings', () => {
  setup();
  expect(screen.getByText('Lead').tagName).toBe('STRONG');
  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(2);
  expect(within(items[1]).getByRole('link', { name: 'link' })).toHaveAttribute('href', '/legal');
  expect(screen.getByRole('heading', { level: 2, name: 'A sub heading' })).toBeInTheDocument();
  expect(screen.getByText('Closing text')).toBeInTheDocument();
});

test('renders nothing harmful for an unknown block type', () => {
  render(
    <MemoryRouter>
      <PolicyPage page={{ title: 'X', sections: [{ id: 'a', title: 'A', blocks: [{ type: 'nope' }] }] }} />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { level: 2, name: 'A' })).toBeInTheDocument();
});
