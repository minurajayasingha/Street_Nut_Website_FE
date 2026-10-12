import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchField from '../components/search/SearchField';
import SearchResults from '../components/search/SearchResults';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { searchProducts } from '../services/productService';
import { searchPath } from '../utils/searchPath';
import styles from './Search.module.css';

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const navigate = useNavigate();
  const [term, setTerm] = useState(q);
  const [lookup, setLookup] = useState({ term: null, items: [] });

  useEffect(() => {
    setTerm(q);
  }, [q]);

  useEffect(() => {
    let active = true;
    searchProducts(q).then((items) => {
      if (active) setLookup({ term: q, items });
    });
    return () => {
      active = false;
    };
  }, [q]);

  const settled = lookup.term === q;

  return (
    <div className={styles.results}>
      <h1 className={styles.title}>Search results for {q}</h1>
      {!isDesktop && (
        <div className={styles.field}>
          <SearchField
            variant="strip"
            value={term}
            onChange={setTerm}
            onSubmit={(value) => navigate(searchPath(value))}
            showEnter={term.trim() !== q}
          />
        </div>
      )}
      <SearchResults term={q} items={settled ? lookup.items : []} settled={settled} />
    </div>
  );
}
