import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Drawer from '../ui/Drawer';
import AnnouncementBar from './AnnouncementBar';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './Header.module.css';

export default function Header({ nav, siteName, announcement }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const primary = nav?.primary ?? [];
  const secondary = nav?.secondary ?? [];

  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt={siteName} />
      </Link>

      <AnnouncementBar text={announcement} />

      <div className={styles.actions}>
        <button>Search</button>
        <button>Bag</button>
        <button className={styles.menuButton} onClick={() => setMenuOpen(true)}>
          Menu
        </button>
      </div>

      <nav className={styles.sideNav} aria-label="Main">
        {primary.map((item) => (
          <Link key={item.href} to={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
        {secondary.length > 0 && (
          <span className={styles.separator} aria-hidden="true">&ndash;</span>
        )}
        {secondary.map((item) => (
          <Link key={item.href} to={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu">
        <nav aria-label="Mobile">
          {[...primary, ...secondary].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={styles.drawerLink}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
