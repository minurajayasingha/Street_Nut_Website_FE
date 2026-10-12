import { act } from '@testing-library/react';

// A matchMedia mock whose "desktop" state can be switched during a test.
let desktop = false;
const listeners = new Set();

window.matchMedia = (query) => ({
  get matches() {
    return desktop && query.includes('min-width: 1025px');
  },
  media: query,
  onchange: null,
  addEventListener(_type, listener) {
    listeners.add(listener);
  },
  removeEventListener(_type, listener) {
    listeners.delete(listener);
  },
  addListener() {},
  removeListener() {},
  dispatchEvent() {
    return false;
  },
});

export function setDesktop(value) {
  desktop = value;
  act(() => listeners.forEach((listener) => listener()));
}
