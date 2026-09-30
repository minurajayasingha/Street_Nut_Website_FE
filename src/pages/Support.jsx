import { useEffect, useState } from 'react';
import Accordion from '../components/ui/Accordion';
import PageContainer, { PageTitle } from '../components/layout/PageContainer';
import { getSupportPage } from '../services/pageService';
import styles from './Support.module.css';

export default function Support() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    let active = true;
    getSupportPage().then((data) => {
      if (active) setPage(data);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!page) return null;
  const { contact, faqTitle, faq } = page;
  const items = faq.map((f) => ({ id: f.id, title: f.question, content: f.answer }));

  return (
    <PageContainer flushTablet>
      <PageTitle className={styles.contactTitle}>{contact.title}</PageTitle>
      <div className={styles.text}>
        <p>{contact.chatHeading}</p>
        <button type="button" className={styles.chat}>
          {contact.chatLabel}
        </button>
        <p>
          <strong>{contact.emailHeading}</strong>
          <br />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        <p>
          <strong>{contact.hoursHeading}</strong>
          <br />
          {contact.hours}
          <br />
          <em>{contact.hoursNote}</em>
        </p>
        <ul aria-label="Social links">
          {contact.social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <PageTitle as="h2" className={styles.faqTitle}>
        {faqTitle}
      </PageTitle>
      <Accordion items={items} className={styles.faq} />
    </PageContainer>
  );
}
