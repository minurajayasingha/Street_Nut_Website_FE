import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollLock } from '../../hooks/useScrollLock';
import { searchProducts } from '../../services/productService';
import { searchPath } from '../../utils/searchPath';
import SearchField from './SearchField';
import SearchResults from './SearchResults';
import styles from './SearchBar.module.css';

const LOOKUP_DELAY_MS = 150;
const EMPTY_LOOKUP = { term: '', items: [] };

export default function SearchBar({ open, persistent = false, initialTerm = '', focusKey = 0, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [term, setTerm] = useState(initialTerm);
  const [lookup, setLookup] = useState(EMPTY_LOOKUP);

  const visible = open || (persistent && isDesktop);
  const trimmed = term.trim();
  const edited = !persistent || term !== initialTerm;
  const showPanel = visible && trimmed !== '' && edited;

  useScrollLock(open);

  // Closing resets the field to the page's own term (empty off the results page)
  useEffect(() => {
    if (!open) setTerm(initialTerm);
  }, [open, initialTerm]);

  useEffect(() => {
    if (visible && (open || focusKey > 0)) inputRef.current?.focus();
  }, [visible, open, focusKey]);

  useEffect(() => {
    if (!showPanel) {
      setLookup((current) => (current.items.length === 0 && current.term === '' ? current : EMPTY_LOOKUP));
      return undefined;
    }
    let active = true;
    const timer = setTimeout(() => {
      searchProducts(trimmed).then((items) => {
        if (active) setLookup({ term: trimmed, items });
      });
    }, LOOKUP_DELAY_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [showPanel, trimmed]);

  // ESC clears the term; on mobile it also closes (measured on the reference)
  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setTerm('');
      if (!isDesktop) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, isDesktop, onClose]);

  // Click outside closes; the header toggle handles its own click
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (event.target.closest?.('[data-search-toggle]')) return;
      onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, onClose]);

  if (!visible) return null;

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={isDesktop ? styles.bar : styles.strip}>
        <SearchField
          variant={isDesktop ? 'bar' : 'strip'}
          value={term}
          onChange={setTerm}
          onSubmit={(value) => navigate(searchPath(value))}
          onClear={() => {
            setTerm('');
            inputRef.current?.focus();
          }}
          inputRef={inputRef}
          showViewAll={showPanel}
        />
      </div>
      {showPanel && (
        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <SearchResults term={trimmed} items={lookup.items} settled={lookup.term === trimmed} centered />
          </div>
        </div>
      )}
    </div>
  );
}
