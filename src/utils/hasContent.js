// The one rule for "does this product have data here". Empty strings, blank
// strings, empty arrays and arrays of blanks all count as no content.
export function hasContent(value) {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasContent);
  return true;
}
