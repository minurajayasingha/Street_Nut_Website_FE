import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnnouncementBar from './AnnouncementBar';

test('shows the announcement text', () => {
  render(<AnnouncementBar text="Free shipping" />);
  expect(screen.getByText('Free shipping')).toBeInTheDocument();
});

test('renders nothing when text is empty', () => {
  const { container } = render(<AnnouncementBar text="" />);
  expect(container).toBeEmptyDOMElement();
});

test('HIDE removes the announcement', async () => {
  render(<AnnouncementBar text="Free shipping" />);
  await userEvent.setup().click(screen.getByRole('button', { name: /hide/i }));
  expect(screen.queryByText('Free shipping')).not.toBeInTheDocument();
});
