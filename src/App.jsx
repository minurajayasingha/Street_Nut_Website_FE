import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Product from './pages/Product';
import NotFound from './pages/NotFound';
import Archive from './pages/Archive';
import Chapters from './pages/Chapters';
import Support from './pages/Support';
import ShippingReturns from './pages/support/ShippingReturns';
import SizeGuide from './pages/support/SizeGuide';
import Warranty from './pages/support/Warranty';
import Accessibility from './pages/support/Accessibility';
import Legal from './pages/legal/Legal';
import Search from './pages/Search';

// Developer-only design system page: lazy and dev-gated so it never ships in the production bundle
const DesignSystemPage = import.meta.env.DEV ? lazy(() => import('./design-system/DesignSystemPage')) : null;

export default function App() {
  return (
    <Routes>
      {DesignSystemPage && (
        <Route
          path="design-system"
          element={
            <Suspense fallback={null}>
              <DesignSystemPage />
            </Suspense>
          }
        />
      )}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="collections/:handle" element={<Collection />} />
        <Route path="products/:slug" element={<Product />} />
        <Route path="archive" element={<Archive />} />
        <Route path="chapters" element={<Chapters />} />
        <Route path="support">
          <Route index element={<Support />} />
          <Route path="shipping-returns" element={<ShippingReturns />} />
          <Route path="size-guide" element={<SizeGuide />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="accessibility" element={<Accessibility />} />
        </Route>
        <Route path="legal" element={<Legal />} />
        <Route path="search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
