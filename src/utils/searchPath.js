export const searchPath = (term) => `/search?q=${encodeURIComponent(String(term ?? '').trim())}`;
