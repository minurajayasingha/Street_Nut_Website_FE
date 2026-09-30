import TextPage from '../../components/layout/TextPage';
import { usePageData } from '../../hooks/usePageData';
import { getWarranty } from '../../services/pageService';

export default function Warranty() {
  const page = usePageData(getWarranty);
  return page ? <TextPage page={page} /> : null;
}
