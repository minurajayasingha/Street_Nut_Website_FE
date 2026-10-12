import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

test('home route renders the hero video', async () => {
  const { container } = renderAt('/');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(await screen.findByLabelText(/hero film/i)).toBeInTheDocument();
  expect(container.querySelector('main video')).toBeInTheDocument();
});

test('unknown route renders NotFound inside layout', () => {
  renderAt('/nope/nothing');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument();
});

test('legal route renders the title and its accordion items', async () => {
  renderAt('/legal');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: /^legal$/i })).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: /terms of use/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /privacy policy/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /personal info/i })).toBeInTheDocument();
});

test('legal sub routes no longer exist', () => {
  renderAt('/legal/terms-of-service');
  expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument();
});

test.each([
  ['/archive', /archive/i],
  ['/chapters', /chapters/i],
])('%s route renders inside layout', (path, heading) => {
  renderAt(path);
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
});

test('not found heading uses the error tone', () => {
  renderAt('/nope/nothing');
  expect(screen.getByRole('heading', { name: /not found/i })).toHaveAttribute('data-tone', 'error');
});

test('/products/:slug shows the product, an unknown slug shows not found', async () => {
  const { unmount } = renderAt('/products/fresh-foils-tee-black');
  expect(await screen.findByRole('heading', { level: 1, name: 'Fresh Foils Tee' })).toBeInTheDocument();
  unmount();
  renderAt('/products/some-product');
  expect(await screen.findByRole('heading', { name: /not found/i })).toHaveAttribute(
    'data-tone',
    'error'
  );
});

test.each([
])('support sub route %s renders inside layout', (path, heading) => {
  renderAt(path);
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
});

test('support route renders the contact page inside layout', async () => {
  renderAt('/support');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { level: 1, name: /contact us/i })).toBeInTheDocument();
});

test('shipping & returns route renders its policy page inside layout', async () => {
  renderAt('/support/shipping-returns');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { level: 1, name: /shipping & returns/i })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { level: 2, name: /return guidelines/i })).toBeInTheDocument();
});

test.each([
  ['/support/warranty', /eyewear warranty/i],
  ['/support/accessibility', /^accessibility$/i],
])('support text route %s renders its page inside layout', async (path, heading) => {
  renderAt(path);
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
});

test('size guide route renders its disclaimer and both tables inside layout', async () => {
  renderAt('/support/size-guide');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { level: 1, name: /size guide/i })).toBeInTheDocument();
  expect(screen.getByRole('table', { name: /international size conversions/i })).toBeInTheDocument();
  expect(screen.getByRole('table', { name: /body measurements/i })).toBeInTheDocument();
});

test('design system page is available in development, outside the site layout', async () => {
  renderAt('/design-system');
  // First load of the lazy chunk can be slow while other test files run in parallel
  expect(
    await screen.findByRole('heading', { level: 1, name: /design system/i }, { timeout: 8000 })
  ).toBeInTheDocument();
  expect(screen.queryByRole('banner')).not.toBeInTheDocument();
}, 15000);

test('collection route renders the product grid inside the layout', async () => {
  renderAt('/collections/tees');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect((await screen.findAllByRole('article')).length).toBeGreaterThan(0);
});
