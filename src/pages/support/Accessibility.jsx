import TextPage from '../../components/layout/TextPage';
import { usePageData } from '../../hooks/usePageData';
import { getAccessibility } from '../../services/pageService';

export default function Accessibility() {
  const page = usePageData(getAccessibility);
  return page ? <TextPage page={page} /> : null;
}
