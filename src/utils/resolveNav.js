const inSection = (pathname, match) => pathname === match || pathname.startsWith(`${match}/`);

export function resolveNav(nav, pathname) {
  const context = nav?.contexts?.find((c) => inSection(pathname, c.match));
  const source = context ?? nav;
  return { primary: source?.primary ?? [], secondary: source?.secondary ?? [] };
}
