import { getSizeChart } from './productService';

test('returns a known chart with units, rows and notes', async () => {
  const chart = await getSizeChart('tops');
  expect(chart.units.length).toBeGreaterThan(0);
  chart.units.forEach((unit) => {
    expect(unit.rows[0][0]).toBe('Size');
    // every row has the same number of columns as the header
    unit.rows.forEach((row) => expect(row).toHaveLength(unit.rows[0].length));
  });
  expect(chart.notes.length).toBeGreaterThan(0);
});

test('every unit of a chart lists the same measurements', async () => {
  const { units } = await getSizeChart('tops');
  const labels = units.map((u) => u.rows.map((r) => r[0]));
  labels.forEach((l) => expect(l).toEqual(labels[0]));
});

test('unknown, empty or missing key gives null', async () => {
  expect(await getSizeChart('no-such-chart')).toBeNull();
  expect(await getSizeChart('')).toBeNull();
  expect(await getSizeChart()).toBeNull();
});
