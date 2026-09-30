import { resolveNav } from './resolveNav';

const nav = {
  primary: [{ label: 'Tees', href: '/collections/tees' }],
  secondary: [{ label: 'Support', href: '/support' }],
  contexts: [
    {
      match: '/support',
      primary: [{ label: 'Support', href: '/support' }],
      secondary: [{ label: 'Account', href: '/account' }],
    },
  ],
};

test('returns the default lists outside any context', () => {
  const r = resolveNav(nav, '/legal');
  expect(r.primary).toEqual(nav.primary);
  expect(r.secondary).toEqual(nav.secondary);
});

test('returns the context lists on the section root and its sub paths', () => {
  expect(resolveNav(nav, '/support').primary).toEqual(nav.contexts[0].primary);
  expect(resolveNav(nav, '/support/size-guide').secondary).toEqual(nav.contexts[0].secondary);
});

test('does not match a path that only shares a prefix', () => {
  expect(resolveNav(nav, '/supporters').primary).toEqual(nav.primary);
});

test('copes with missing lists and contexts', () => {
  expect(resolveNav(undefined, '/')).toEqual({ primary: [], secondary: [] });
  expect(resolveNav({ primary: [{ label: 'A', href: '/a' }] }, '/').secondary).toEqual([]);
});
