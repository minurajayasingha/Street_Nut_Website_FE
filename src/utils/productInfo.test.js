import { getInfoItems } from './productInfo';

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
