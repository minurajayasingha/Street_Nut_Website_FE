import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import NotFound from './NotFound';
import ProductGallery from '../components/product/ProductGallery';
import ColorSwitch from '../components/product/ColorSwitch';
import SizePicker from '../components/product/SizePicker';
import AddToBag from '../components/product/AddToBag';
import ProductInfo from '../components/product/ProductInfo';
import { getProductBySlug, getProductFamily, getSizeChart } from '../services/productService';
import { getSiteInfo } from '../services/siteService';
import { formatPrice } from '../utils/formatPrice';
import { getProductState } from '../utils/productState';
import { getSizeChartKeys } from '../utils/productInfo';
import { hasContent } from '../utils/hasContent';
import { useBag } from '../hooks/useBag';
import styles from './Product.module.css';

function ProductDetail({ product, family, charts, site, initialSize }) {
  const state = getProductState(product);
  const soldOut = state === 'soldOut';
  const showSizes = state === 'default';
  const startSize =
    showSizes && product.sizes.some((s) => s.label === initialSize && s.available)
      ? initialSize
      : null;
  const [size, setSize] = useState(startSize);
  const { openBag } = useBag();
  // The info column scrolls on its own on desktop; ProductInfo scrolls an opened row to its top
  const columnRef = useRef(null);
  const label = hasContent(product.color) ? `${product.color} ${product.name}` : product.name;

  return (
    <div className={styles.page}>
      <ProductGallery images={product.images} label={label} />
      <div className={styles.info} ref={columnRef}>
        <div className={styles.stack}>
          <h1 className={styles.title}>{product.name}</h1>
          {product.price != null && (
            <p className={styles.line}>{formatPrice(product.price, product.currency)}</p>
          )}
          {hasContent(product.color) && <p className={styles.muted}>{product.color}</p>}
          {hasContent(product.badge) && <p className={styles.muted}>{product.badge}</p>}
          {showSizes && <SizePicker sizes={product.sizes} value={size} onChange={setSize} />}
          <ColorSwitch products={family} currentSlug={product.slug} />
          {soldOut ? (
            <p className={styles.soldOut}>Sold out</p>
          ) : (
            <AddToBag disabled={showSizes && size === null} onClick={openBag} />
          )}
          <ProductInfo
            product={product}
            charts={charts}
            chat={site?.chat}
            note={site?.productNote}
            scrollRef={columnRef}
          />
        </div>
      </div>
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  // undefined = still loading, null = no such product
  const [product, setProduct] = useState(undefined);
  const [family, setFamily] = useState([]);
  const [charts, setCharts] = useState({});
  const [site, setSite] = useState(null);

  useEffect(() => {
    let active = true;
    getSiteInfo().then((info) => {
      if (active) setSite(info);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setProduct(undefined);
    setFamily([]);
    setCharts({});
    getProductBySlug(slug).then(async (found) => {
      if (!active) return;
      setProduct(found);
      if (found?.family) {
        const siblings = await getProductFamily(found.family);
        if (active) setFamily(siblings);
      }
      // Size charts: one per key the product's info entries ask for; unknown keys are left out
      const keys = getSizeChartKeys(found);
      if (keys.length > 0) {
        const loaded = await Promise.all(keys.map(async (key) => [key, await getSizeChart(key)]));
        if (active) setCharts(Object.fromEntries(loaded.filter(([, blocks]) => blocks)));
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (product === undefined) return null;
  if (product === null) return <NotFound />;

  // key: moving to another colour starts with a fresh size choice
  return (
    <ProductDetail
      key={product.slug}
      product={product}
      family={family}
      charts={charts}
      site={site}
      initialSize={searchParams.get('size')}
    />
  );
}
