import { useEffect, useState } from 'react';
import ProductGrid from '../components/product/ProductGrid';
import { getProducts } from '../services/productService';

export default function Collection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    getProducts().then((list) => {
      if (active) setProducts(list);
    });
    return () => {
      active = false;
    };
  }, []);

  return <ProductGrid products={products} />;
}
