import { render, screen } from '@testing-library/react';
import HeroMedia from './HeroMedia';

test('renders a muted, looping, autoplaying inline video from videoSrc', () => {
  const { container } = render(<HeroMedia videoSrc="/videos/hero.mp4" poster="/hero.jpg" alt="Hero" />);
  const video = container.querySelector('video');
  expect(video).toBeInTheDocument();
  expect(video.getAttribute('src')).toBe('/videos/hero.mp4');
  expect(video.getAttribute('poster')).toBe('/hero.jpg');
  expect(video.muted).toBe(true);
  expect(video.loop).toBe(true);
  expect(video.autoplay).toBe(true);
  expect(video.hasAttribute('playsinline')).toBe(true);
});

test('the video is labelled for assistive tech', () => {
  render(<HeroMedia videoSrc="/videos/hero.mp4" alt="Hero film" />);
  expect(screen.getByLabelText('Hero film')).toBeInTheDocument();
});

test('without a videoSrc it shows the poster image instead', () => {
  const { container } = render(<HeroMedia poster="/hero.jpg" alt="Hero" />);
  expect(container.querySelector('video')).toBeNull();
  expect(screen.getByRole('img', { name: 'Hero' })).toHaveAttribute('src', '/hero.jpg');
});

test('without a videoSrc or poster it still renders an empty frame', () => {
  const { container } = render(<HeroMedia />);
  expect(container.querySelector('video')).toBeNull();
  expect(screen.queryByRole('img')).toBeNull();
  expect(container.firstChild).toBeInTheDocument();
});
