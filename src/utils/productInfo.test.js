import { getInfoItems, getSizeChartKeys } from './productInfo';

const chart = { units: [{ id: 'in', label: 'Inches', rows: [['Size', 'S', 'M']] }] };

test('a size chart entry uses the chart, keeping its position', () => {
  const items = getInfoItems(
    {
      info: [
        { title: 'Product details', body: 'Relaxed' },
        { title: 'Size guide', sizeChart: 'tops' },
        { title: 'Shipping', body: 'Free' },
      ],
    },
    { tops: chart }
  );
  expect(items.map((i) => i.title)).toEqual(['Product details', 'Size guide', 'Shipping']);
  expect(items[1]).toEqual({ id: 'info-1', title: 'Size guide', chart });
});

test('a size chart entry without a loaded chart is dropped', () => {
  const info = [{ title: 'Size guide', sizeChart: 'pants' }];
  expect(getInfoItems({ info }, {})).toEqual([]);
  expect(getInfoItems({ info })).toEqual([]);
  expect(getInfoItems({ info }, { pants: {} })).toEqual([]);
  expect(getInfoItems({ info }, { pants: { units: [] } })).toEqual([]);
  expect(getInfoItems({ info }, { pants: { units: [{ id: 'in', rows: [] }] } })).toEqual([]);
  expect(getInfoItems({ info }, { pants: null })).toEqual([]);
});

test('chart keys are listed once, ignoring blanks and malformed info', () => {
  expect(
    getSizeChartKeys({
      info: [
        { title: 'Size guide', sizeChart: 'tops' },
        { title: 'Again', sizeChart: 'tops' },
        { title: 'Blank', sizeChart: '  ' },
        { title: 'Text', body: 'x' },
        null,
      ],
    })
  ).toEqual(['tops']);
  expect(getSizeChartKeys({})).toEqual([]);
  expect(getSizeChartKeys({ info: 'nope' })).toEqual([]);
});

test('turns info entries into accordion items with trimmed lines', () => {
  const items = getInfoItems({
    info: [
      { title: ' Care ', body: ['Wash cold', ' Do not tumble dry '] },
      { title: 'Fit', body: 'Boxy fit' },
    ],
  });
  expect(items).toEqual([
    { id: 'info-0', title: 'Care', lines: ['Wash cold', 'Do not tumble dry'] },
    { id: 'info-1', title: 'Fit', lines: ['Boxy fit'] },
  ]);
});

test('drops entries without a title or without any body text', () => {
  const items = getInfoItems({
    info: [
      { title: 'Care', body: '   ' },
      { title: 'Fit', body: ['', ' '] },
      { title: '', body: 'Orphan text' },
      { body: 'No title' },
      null,
      { title: 'Materials', body: 'Cotton' },
    ],
  });
  expect(items.map((i) => i.title)).toEqual(['Materials']);
});

test('missing or malformed info gives an empty list', () => {
  expect(getInfoItems({})).toEqual([]);
  expect(getInfoItems({ info: null })).toEqual([]);
  expect(getInfoItems({ info: 'Care: wash cold' })).toEqual([]);
});
