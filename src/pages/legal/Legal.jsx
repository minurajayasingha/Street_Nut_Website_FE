import Accordion from '../../components/ui/Accordion';
import ContentBlocks from '../../components/ui/ContentBlocks';
import PageContainer, { PageTitle } from '../../components/layout/PageContainer';
import { usePageData } from '../../hooks/usePageData';
import { getLegalPages } from '../../services/pageService';
import styles from './Legal.module.css';

export default function Legal() {
  const pages = usePageData(getLegalPages) ?? [];

  const items = pages.map((p) => ({
    id: p.slug,
    title: p.title,
    content: <ContentBlocks blocks={p.blocks} className={styles.blocks} />,
  }));

  return (
    <PageContainer>
      <PageTitle>Legal</PageTitle>
      <Accordion items={items} />
    </PageContainer>
  );
}
