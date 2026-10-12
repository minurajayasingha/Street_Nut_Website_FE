import { render, screen } from '@testing-library/react';
import ProductGallery from './ProductGallery';

test('shows every image in order with a numbered alt text', () => {
  render(<ProductGallery images={['/a/1.webp', '/a/2.webp', '/a/3.webp']} label="Black A Tee" />);
  const imgs = screen.getAllByRole('img');
  expect(imgs.map((i) => i.getAttribute('src'))).toEqual(['/a/1.webp', '/a/2.webp', '/a/3.webp']);
  expect(imgs[0]).toHaveAccessibleName('Black A Tee, image 1');
  expect(imgs[2]).toHaveAccessibleName('Black A Tee, image 3');
});

test('the first image loads eagerly, the rest lazily', () => {
  render(<ProductGallery images={['/a/1.webp', '/a/2.webp']} label="A Tee" />);
  const [first, second] = screen.getAllByRole('img');
  expect(first).toHaveAttribute('loading', 'eager');
  expect(second).toHaveAttribute('loading', 'lazy');
});

test('blank entries are skipped', () => {
  render(<ProductGallery images={['', '/a/1.webp', '  ']} label="A Tee" />);
  expect(screen.getAllByRole('img')).toHaveLength(1);
});

test('renders nothing without images', () => {
  const { container, rerender } = render(<ProductGallery images={[]} label="A Tee" />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductGallery label="A Tee" />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductGallery images={['', ' ']} label="A Tee" />);
  expect(container).toBeEmptyDOMElement();
});
