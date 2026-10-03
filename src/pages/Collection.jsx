import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { getProducts } from '../services/productService';

export default function Collection() {
  const { handle } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    getProducts({ collection: handle }).then((list) => {
      if (active) setProducts(list);
    });
    return () => {
      active = false;
    };
  }, [handle]);

  return <ProductGrid products={products} />;
}
