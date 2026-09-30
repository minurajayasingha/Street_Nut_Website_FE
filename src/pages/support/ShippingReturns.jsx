import PolicyPage from '../../components/layout/PolicyPage';
import { usePageData } from '../../hooks/usePageData';
import { getShippingReturns } from '../../services/pageService';

export default function ShippingReturns() {
  const page = usePageData(getShippingReturns);
  return page ? <PolicyPage page={page} /> : null;
}
