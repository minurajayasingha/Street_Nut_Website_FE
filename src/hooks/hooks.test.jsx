import { render } from '@testing-library/react';
import { useScrollLock } from './useScrollLock';

function Probe({ locked }) {
  useScrollLock(locked);
  return null;
}

test('locks and restores body scroll', () => {
  document.body.style.overflow = '';
  const { rerender, unmount } = render(<Probe locked={true} />);
  expect(document.body.style.overflow).toBe('hidden');
  rerender(<Probe locked={false} />);
  expect(document.body.style.overflow).toBe('');
  rerender(<Probe locked={true} />);
  unmount();
  expect(document.body.style.overflow).toBe('');
});
