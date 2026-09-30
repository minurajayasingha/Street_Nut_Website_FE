import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Product from './pages/Product';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="collections/:handle" element={<Collection />} />
        <Route path="products/:slug" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
