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

describe('dismissal is remembered', () => {
  beforeEach(() => sessionStorage.clear());

  test('stays hidden after a remount (page refresh)', async () => {
    const { unmount } = render(<AnnouncementBar text="Free shipping" />);
    await userEvent.setup().click(screen.getByRole('button', { name: /hide/i }));
    unmount();
    render(<AnnouncementBar text="Free shipping" />);
    expect(screen.queryByText('Free shipping')).not.toBeInTheDocument();
  });

  test('a different announcement shows again', async () => {
    const { unmount } = render(<AnnouncementBar text="Free shipping" />);
    await userEvent.setup().click(screen.getByRole('button', { name: /hide/i }));
    unmount();
    render(<AnnouncementBar text="New drop Friday" />);
    expect(screen.getByText('New drop Friday')).toBeInTheDocument();
  });

  test('still works when storage is unavailable', async () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<AnnouncementBar text="Free shipping" />);
    await userEvent.setup().click(screen.getByRole('button', { name: /hide/i }));
    expect(screen.queryByText('Free shipping')).not.toBeInTheDocument();
    spy.mockRestore();
  });
});
