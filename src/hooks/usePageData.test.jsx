import { render, screen } from '@testing-library/react';
import { usePageData } from './usePageData';

function Probe({ load }) {
  const data = usePageData(load);
  return <p>{data ? data.title : 'loading'}</p>;
}

test('is null until the service resolves, then returns the data', async () => {
  const load = () => Promise.resolve({ title: 'Loaded' });
  render(<Probe load={load} />);
  expect(screen.getByText('loading')).toBeInTheDocument();
  expect(await screen.findByText('Loaded')).toBeInTheDocument();
});

test('ignores a result that arrives after unmount', async () => {
  let resolve;
  const load = () => new Promise((r) => (resolve = r));
  const errors = [];
  const spy = console.error;
  console.error = (...args) => errors.push(args);
  const { unmount } = render(<Probe load={load} />);
  unmount();
  resolve({ title: 'Late' });
  await Promise.resolve();
  console.error = spy;
  expect(errors).toHaveLength(0);
});
