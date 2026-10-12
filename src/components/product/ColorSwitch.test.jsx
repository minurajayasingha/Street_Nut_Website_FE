import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ColorSwitch from './ColorSwitch';

const family = [
  { slug: 'a-black', name: 'A Tee', color: 'Black', images: ['/a/black.webp'] },
  { slug: 'a-red', name: 'A Tee', color: 'Red', images: ['/a/red.webp'] },
  { slug: 'a-rock', name: 'A Tee', color: 'Rock' },
];

const setup = (props) =>
  render(
    <MemoryRouter>
      <ColorSwitch products={family} currentSlug="a-red" {...props} />
    </MemoryRouter>
  );

test('links every colour to its own page and marks the current one', () => {
  setup();
  const red = screen.getByRole('link', { name: 'Red' });
  expect(red).toHaveAttribute('href', '/products/a-red');
  expect(red).toHaveAttribute('aria-current', 'true');
  const black = screen.getByRole('link', { name: 'Black' });
  expect(black).toHaveAttribute('href', '/products/a-black');
  expect(black).not.toHaveAttribute('aria-current');
});

test('uses the first image as the thumbnail, text when there is none', () => {
  setup();
  expect(screen.getByRole('link', { name: 'Black' }).querySelector('img')).toHaveAttribute(
    'src',
    '/a/black.webp'
  );
  expect(screen.getByRole('link', { name: 'Rock' })).toHaveTextContent('Rock');
});

test('renders nothing for a family of one, an empty list or no list', () => {
  const { container, rerender } = setup({ products: [family[0]] });
  expect(container).toBeEmptyDOMElement();
  rerender(
    <MemoryRouter>
      <ColorSwitch products={[]} currentSlug="x" />
    </MemoryRouter>
  );
  expect(container).toBeEmptyDOMElement();
  rerender(
    <MemoryRouter>
      <ColorSwitch currentSlug="x" />
    </MemoryRouter>
  );
  expect(container).toBeEmptyDOMElement();
});
