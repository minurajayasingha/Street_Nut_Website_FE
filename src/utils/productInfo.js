import { hasContent } from './hasContent';

// product.info: [{ title, body }] or [{ title, sizeChart }].
// body is a string or an array of strings; sizeChart is the key of a chart the page loaded
// into `charts` ({ [key]: { notes?, units: [{ id, label, rows }], image? } }).
// Entries with nothing to show are dropped.
const hasUsableUnit = (chart) =>
  Array.isArray(chart?.units) && chart.units.some((unit) => unit?.rows?.length > 0);

export function getInfoItems(product, charts = {}) {
  if (!Array.isArray(product?.info)) return [];
  const items = [];
  product.info.forEach((entry) => {
    if (!hasContent(entry?.title)) return;
    const title = String(entry.title).trim();
    const id = `info-${items.length}`;
    if (hasContent(entry.sizeChart)) {
      const chart = charts?.[String(entry.sizeChart).trim()];
      if (hasUsableUnit(chart)) items.push({ id, title, chart });
      return;
    }
    if (!hasContent(entry.body)) return;
    items.push({
      id,
      title,
      lines: [].concat(entry.body).filter(hasContent).map((line) => String(line).trim()),
    });
  });
  return items;
}

// Chart keys a product asks for, so the page knows what to load.
export function getSizeChartKeys(product) {
  if (!Array.isArray(product?.info)) return [];
  const keys = product.info
    .filter((entry) => hasContent(entry?.sizeChart))
    .map((entry) => String(entry.sizeChart).trim());
  return [...new Set(keys)];
}
