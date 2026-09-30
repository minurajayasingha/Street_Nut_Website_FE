import ContentBlocks from '../ui/ContentBlocks';
import PageContainer, { PageTitle } from './PageContainer';
import styles from './TextPage.module.css';

// lineHeight: 'rte' (1.6em, the default) or 'prose' (policy-page line height)
export default function TextPage({ page, lineHeight = 'rte' }) {
  return (
    <PageContainer flushTablet className={styles.page}>
      <PageTitle className={styles.title}>{page.title}</PageTitle>
      <ContentBlocks
        blocks={page.blocks}
        className={lineHeight === 'rte' ? styles.rte : undefined}
      />
    </PageContainer>
  );
}
