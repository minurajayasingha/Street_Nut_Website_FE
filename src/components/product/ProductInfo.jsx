import { useEffect, useState } from 'react';
import Accordion from '../ui/Accordion';
import SizeChart from './SizeChart';
import { hasContent } from '../../utils/hasContent';
import { getInfoItems } from '../../utils/productInfo';
import styles from './ProductInfo.module.css';

// chat and note are site-wide (from the site service); a product's own description replaces the note.
// scrollRef is the info column when it scrolls on its own (desktop): opening a row brings it to the top.
export default function ProductInfo({ product, charts, chat, note, scrollRef }) {
  const [openId, setOpenId] = useState(null);

  // Runs after the open row has rendered, so the column is tall enough to scroll to it
  useEffect(() => {
    if (!openId) return;
    const column = scrollRef?.current;
    const row = column?.querySelector('[aria-expanded="true"]')?.parentElement;
    if (!column || !row || column.scrollHeight <= column.clientHeight) return;
    const delta = row.getBoundingClientRect().top - column.getBoundingClientRect().top;
    column.scrollTo?.({ top: column.scrollTop + delta, behavior: 'smooth' });
  }, [openId, scrollRef]);

  const items = getInfoItems(product, charts);
  const noteText = hasContent(product.description) ? product.description : note;
  const showChat = hasContent(chat);
  const showNote = hasContent(noteText);
  if (items.length === 0 && !showChat && !showNote) return null;

  const accordionItems = items.map(({ id, title, lines, chart }) => ({
    id,
    title,
    content: chart ? (
      <SizeChart chart={chart} />
    ) : (
      <ul className={styles.lines}>
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    ),
  }));

  // The first line under the accordions sits 4px below them; with no accordions it gets the block gap
  const first = items.length > 0 ? styles.afterAccordion : styles.afterButton;

  return (
    <>
      {items.length > 0 && (
        <Accordion items={accordionItems} className={styles.accordion} onChange={setOpenId} />
      )}
      {showChat && <p className={first}>{chat.trim()}</p>}
      {showNote && <p className={showChat ? styles.note : first}>{noteText.trim()}</p>}
    </>
  );
}
