import TextPage from '../../components/layout/TextPage';
import { usePageData } from '../../hooks/usePageData';
import { getSizeGuide } from '../../services/pageService';

export default function SizeGuide() {
  const page = usePageData(getSizeGuide);
  return page ? <TextPage page={page} lineHeight="prose" /> : null;
}
