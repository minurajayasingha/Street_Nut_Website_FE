import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getSiteInfo } from '../../services/siteService';
import { getNavigation } from '../../services/navigationService';

export default function Layout() {
  const [site, setSite] = useState(null);
  const [nav, setNav] = useState({ primary: [], secondary: [] });

  useEffect(() => {
    let active = true;
    Promise.all([getSiteInfo(), getNavigation()]).then(([s, n]) => {
      if (!active) return;
      setSite(s);
      setNav(n);
    });
    return () => {
      active = false;
    };
  }, []);

  const siteName = site?.name ?? 'Streetnut';

  return (
    <>
      <Header nav={nav} siteName={siteName} announcement={site?.announcement} />
      <main>
        <Outlet />
      </main>
      <Footer siteName={siteName} />
    </>
  );
}
