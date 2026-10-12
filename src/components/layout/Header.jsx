import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Drawer from '../ui/Drawer';
import Caret from '../ui/Caret';
import AnnouncementBar from './AnnouncementBar';
import SearchBar from '../search/SearchBar';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useBag } from '../../hooks/useBag';
import { resolveNav } from '../../utils/resolveNav';
import styles from './Header.module.css';

const linkClass = (base) => ({ isActive }) =>
  isActive ? `${base} ${styles.navLinkActive}` : base;

function DesktopItem({ item }) {
  const children = item.expanded ? (item.children ?? []) : [];
  return (
    <>
      {item.action ? (
        <button type="button" className={styles.navLink}>
          {item.label}
        </button>
      ) : (
        <NavLink to={item.href} end className={linkClass(styles.navLink)}>
          {item.label}
        </NavLink>
      )}
      {children.length > 0 && (
        <ul className={styles.subNav}>
          {children.map((child) => (
            <li key={child.href ?? child.action} className={styles.subItem}>
              {child.action ? (
                <button type="button" className={styles.subLink}>
                  {child.label}
                </button>
              ) : (
                <NavLink to={child.href} end className={linkClass(styles.subLink)}>
                  {child.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function DrawerItem({ item, open, onToggle, onNavigate }) {
  const children = item.children ?? [];
  if (children.length === 0) {
    return (
      <NavLink to={item.href} end className={linkClass(styles.drawerLink)} onClick={onNavigate}>
        {item.label}
      </NavLink>
    );
  }
  return (
    <>
      <button
        type="button"
        className={`${styles.drawerLink} ${styles.drawerToggle}`}
        aria-expanded={open}
        onClick={onToggle}
      >
        {item.label}
        <Caret
          className={open ? `${styles.drawerCaret} ${styles.drawerCaretOpen}` : styles.drawerCaret}
          width="6"
          height="3.94"
        />
      </button>
      {open && (
        <>
          {children.map((child) =>
            child.action ? (
              <button key={child.action} type="button" className={styles.drawerLink}>
                {child.label}
              </button>
            ) : (
              <NavLink
                key={child.href}
                to={child.href}
                end
                className={linkClass(styles.drawerLink)}
                onClick={onNavigate}
              >
                {child.label}
              </NavLink>
            )
          )}
          <span className={styles.drawerSeparator} aria-hidden="true">&ndash;</span>
        </>
      )}
    </>
  );
}

export default function Header({ nav, siteName, announcement, region }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocusKey, setSearchFocusKey] = useState(0);
  const [openItem, setOpenItem] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();
  const onSearchPage = pathname === '/search';
  const searchAlwaysOpen = onSearchPage && isDesktop;
  const { count, openBag } = useBag();
  const { primary, secondary } = resolveNav(nav, pathname);
  const drawerPrimary = nav?.primary ?? [];
  const drawerSecondary = nav?.secondary ?? [];

  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  // Any navigation closes search
  useEffect(() => {
    setSearchOpen(false);
  }, [pathname, search]);

  const closeMenu = () => setMenuOpen(false);
  const closeSearch = () => setSearchOpen(false);
  const toggleSearch = () => {
    if (searchAlwaysOpen) {
      setSearchFocusKey((key) => key + 1);
      return;
    }
    setSearchOpen((open) => !open);
    setMenuOpen(false);
  };
  const toggleMenu = () => {
    setMenuOpen((open) => !open);
    setSearchOpen(false);
  };
  const drawerItem = (item) => (
    <DrawerItem
      key={item.href}
      item={item}
      open={openItem === item.href}
      onToggle={() => setOpenItem(openItem === item.href ? null : item.href)}
      onNavigate={closeMenu}
    />
  );

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt={siteName} />
      </Link>

      {/* The announcement and the search bar share one cell, so the bar ends where the actions begin */}
      <div className={styles.center}>
        <AnnouncementBar text={searchOpen || searchAlwaysOpen ? undefined : announcement} />
        <SearchBar
          open={searchOpen}
          persistent={onSearchPage}
          initialTerm={onSearchPage ? (searchParams.get('q') ?? '') : ''}
          focusKey={searchFocusKey}
          onClose={closeSearch}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          data-search-toggle
          aria-expanded={searchOpen}
          className={searchOpen || searchAlwaysOpen ? styles.searchActive : undefined}
          onClick={toggleSearch}
        >
          {searchOpen ? 'Close' : 'Search'}
        </button>
        <button type="button" onClick={openBag}>
          {count > 0 ? `Bag (${count})` : 'Bag'}
        </button>
        <button
          className={styles.menuButton}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <nav className={styles.sideNav} aria-label="Main">
        {primary.map((item) => (
          <DesktopItem key={item.href} item={item} />
        ))}
        {secondary.length > 0 && (
          <span className={styles.separator} aria-hidden="true">&ndash;</span>
        )}
        {secondary.map((item) => (
          <DesktopItem key={item.href} item={item} />
        ))}
        {region && (
          <button type="button" className={`${styles.navLink} ${styles.region}`}>
            {region.label}
          </button>
        )}
      </nav>

      <Drawer open={menuOpen} onClose={closeMenu} label="Menu">
        <nav aria-label="Mobile">
          {drawerPrimary.map(drawerItem)}
          {drawerSecondary.length > 0 && (
            <span className={styles.drawerSeparator} aria-hidden="true">&ndash;</span>
          )}
          {drawerSecondary.map(drawerItem)}
          {region && (
            <button type="button" className={`${styles.drawerLink} ${styles.region}`}>
              {region.mobileLabel}
            </button>
          )}
        </nav>
      </Drawer>
    </header>
  );
}
