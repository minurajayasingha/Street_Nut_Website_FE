import { useEffect, useState } from 'react';

// Loads a page's content through a service function; null until it resolves
export function usePageData(load) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    load().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, [load]);

  return data;
}
