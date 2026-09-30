import ContentBlocks from '../ui/ContentBlocks';
import PageContainer, { PageTitle } from './PageContainer';
import styles from './PolicyPage.module.css';

export default function PolicyPage({ page }) {
  return (
    <PageContainer flushTablet className={styles.page}>
      <h1 className={styles.srOnly}>{page.title}</h1>
      {page.sections.map((section) => (
        <section key={section.id} className={styles.section}>
          <PageTitle as="h2" className={styles.title}>
            {section.title}
          </PageTitle>
          <ContentBlocks blocks={section.blocks} />
        </section>
      ))}
    </PageContainer>
  );
}
