import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getBagInfo, getBagItems } from '../services/bagService';

const noop = () => {};
const inert = {
  open: false,
  items: [],
  info: {},
  count: 0,
  subtotal: 0,
  currency: 'USD',
  openBag: noop,
  closeBag: noop,
  setQuantity: noop,
};
const BagContext = createContext(inert);

export function BagProvider({ children, initialItems, initialInfo }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialItems ?? []);
  const [info, setInfo] = useState(initialInfo ?? {});

  useEffect(() => {
    let active = true;
    if (initialItems === undefined) {
      getBagItems().then((loaded) => active && setItems(loaded));
    }
    if (initialInfo === undefined) {
      getBagInfo().then((loaded) => active && setInfo(loaded));
    }
    return () => {
      active = false;
    };
  }, [initialItems, initialInfo]);

  const openBag = useCallback(() => setOpen(true), []);
  const closeBag = useCallback(() => setOpen(false), []);
  const setQuantity = useCallback((id, quantity) => {
    if (!Number.isInteger(quantity)) return;
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const value = useMemo(
    () => ({
      open,
      items,
      info,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      currency: items[0]?.currency ?? 'USD',
      openBag,
      closeBag,
      setQuantity,
    }),
    [open, items, info, openBag, closeBag, setQuantity]
  );
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export const useBag = () => useContext(BagContext);
