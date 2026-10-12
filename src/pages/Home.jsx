import { useEffect, useState } from 'react';
import HeroMedia from '../components/home/HeroMedia';
import { getHomeContent } from '../services/homeService';

export default function Home() {
  const [home, setHome] = useState(null);

  useEffect(() => {
    let active = true;
    getHomeContent().then((content) => {
      if (active) setHome(content);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!home) return null;

  return <HeroMedia {...home.hero} />;
}
