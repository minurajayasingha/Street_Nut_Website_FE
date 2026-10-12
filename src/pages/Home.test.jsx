import { render, screen } from '@testing-library/react';
import Home from './Home';

test('home page renders the hero video from the home service', async () => {
  const { container } = render(<Home />);
  expect(await screen.findByLabelText(/streetnut/i)).toBeInTheDocument();
  expect(container.querySelector('video')).toBeInTheDocument();
});
