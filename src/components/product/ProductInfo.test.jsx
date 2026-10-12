import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductInfo from './ProductInfo';

const info = [
  { title: 'Care', body: ['Wash cold', 'Do not tumble dry'] },
  { title: 'Fit', body: 'Boxy fit' },
];

test('shows one accordion per info entry and the description', async () => {
  render(<ProductInfo product={{ description: 'Free shipping over 100.', info }} />);
  expect(screen.getByRole('button', { name: /Care/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Fit/ })).toBeInTheDocument();
  expect(screen.getByText('Free shipping over 100.')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /Care/ }));
  expect(screen.getByText('Wash cold')).toBeInTheDocument();
  expect(screen.getByText('Do not tumble dry')).toBeInTheDocument();
});

test('with only a description there are no accordions', () => {
  render(<ProductInfo product={{ description: 'Just a note.' }} />);
  expect(screen.getByText('Just a note.')).toBeInTheDocument();
  expect(screen.queryAllByRole('button')).toHaveLength(0);
});

test('with only info there is no description paragraph', () => {
  const { container } = render(<ProductInfo product={{ info }} />);
  expect(screen.getAllByRole('button')).toHaveLength(2);
  expect(container.querySelector('p')).toBeNull();
});

test('entries without text are skipped, no empty accordion', () => {
  render(
    <ProductInfo
      product={{
        info: [
          { title: 'Care', body: '  ' },
          { title: 'Fit', body: 'Boxy fit' },
        ],
      }}
    />
  );
  expect(screen.getAllByRole('button')).toHaveLength(1);
  expect(screen.queryByRole('button', { name: /Care/ })).toBeNull();
});

const charts = {
  tops: { units: [{ id: 'in', label: 'Inches', rows: [['Size', 'S'], ['Chest', '21']] }] },
};

test('a size guide entry opens to the chart table', async () => {
  render(
    <ProductInfo
      product={{ info: [{ title: 'Size guide', sizeChart: 'tops' }] }}
      charts={charts}
    />
  );
  await userEvent.click(screen.getByRole('button', { name: /Size guide/ }));
  expect(screen.getByRole('table', { name: 'Inches size chart' })).toBeInTheDocument();
});

test('a size guide whose chart is missing shows no row', () => {
  render(<ProductInfo product={{ info: [{ title: 'Size guide', sizeChart: 'pants' }] }} charts={charts} />);
  expect(screen.queryByRole('button', { name: /Size guide/ })).toBeNull();
});

test('chat and the site note show under the accordions', () => {
  render(<ProductInfo product={{ info }} chat="Chat" note="Free shipping." />);
  expect(screen.getByText('Chat')).toBeInTheDocument();
  expect(screen.getByText('Free shipping.')).toBeInTheDocument();
});

test('a product description replaces the site note', () => {
  render(<ProductInfo product={{ description: 'Own note.' }} chat="Chat" note="Site note." />);
  expect(screen.getByText('Own note.')).toBeInTheDocument();
  expect(screen.queryByText('Site note.')).toBeNull();
});

test('chat and note alone are enough to show the block; blanks are not', () => {
  const { container, rerender } = render(<ProductInfo product={{}} chat="Chat" />);
  expect(screen.getByText('Chat')).toBeInTheDocument();
  rerender(<ProductInfo product={{}} chat=" " note="" />);
  expect(container).toBeEmptyDOMElement();
});

test('renders nothing when there is nothing to show', () => {
  const { container, rerender } = render(<ProductInfo product={{}} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductInfo product={{ description: '   ', info: [] }} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductInfo product={{ info: [{ title: 'Care', body: [''] }] }} />);
  expect(container).toBeEmptyDOMElement();
  rerender(<ProductInfo product={{ info: 'not a list' }} />);
  expect(container).toBeEmptyDOMElement();
});

describe('opening a row scrolls its column to it', () => {
  const sizeInfo = { info: [{ title: 'Size guide', sizeChart: 'tops' }, ...info] };
  let column;
  let rects;

  beforeEach(() => {
    column = document.createElement('div');
    document.body.append(column);
    column.scrollTo = vi.fn();
    Object.defineProperty(column, 'clientHeight', { value: 200, configurable: true });
    // the column starts at y=100, every row inside it at y=160
    rects = vi
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockImplementation(function rect() {
        return { top: this === column ? 100 : 160, left: 0, width: 0, height: 0, right: 0, bottom: 0 };
      });
  });

  afterEach(() => {
    rects.mockRestore();
    column.remove();
  });

  const setup = () =>
    render(<ProductInfo product={sizeInfo} charts={charts} scrollRef={{ current: column }} />, {
      container: column,
    });

  test('the column scrolls so the opened row is at its top', async () => {
    Object.defineProperty(column, 'scrollHeight', { value: 500, configurable: true });
    setup();
    await userEvent.click(screen.getByRole('button', { name: /Size guide/ }));
    expect(column.scrollTo).toHaveBeenCalledWith({ top: 60, behavior: 'smooth' });
  });

  test('closing a row does not scroll', async () => {
    Object.defineProperty(column, 'scrollHeight', { value: 500, configurable: true });
    setup();
    await userEvent.click(screen.getByRole('button', { name: /Size guide/ }));
    column.scrollTo.mockClear();
    await userEvent.click(screen.getByRole('button', { name: /Size guide/ }));
    expect(column.scrollTo).not.toHaveBeenCalled();
  });

  test('a column that does not overflow is left alone', async () => {
    Object.defineProperty(column, 'scrollHeight', { value: 150, configurable: true });
    setup();
    await userEvent.click(screen.getByRole('button', { name: /Size guide/ }));
    expect(column.scrollTo).not.toHaveBeenCalled();
  });

  test('without a scroll column nothing breaks', async () => {
    render(<ProductInfo product={sizeInfo} charts={charts} />);
    await userEvent.click(screen.getByRole('button', { name: /Size guide/ }));
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
