import { hasContent } from './hasContent';

// product.info: [{ title, body }] where body is a string or an array of strings.
// Entries without a title or without any body text are dropped.
export function getInfoItems(product) {
  if (!Array.isArray(product?.info)) return [];
  return product.info
    .filter((item) => hasContent(item?.title) && hasContent(item?.body))
    .map((item, index) => ({
      id: `info-${index}`,
      title: String(item.title).trim(),
      lines: [].concat(item.body).filter(hasContent).map((line) => String(line).trim()),
    }));
}
