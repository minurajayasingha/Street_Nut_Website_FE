import Accordion from '../ui/Accordion';
import { hasContent } from '../../utils/hasContent';
import { getInfoItems } from '../../utils/productInfo';
import styles from './ProductInfo.module.css';

export default function ProductInfo({ product }) {
  const items = getInfoItems(product);
  const showDescription = hasContent(product.description);
  if (items.length === 0 && !showDescription) return null;

  const accordionItems = items.map(({ id, title, lines }) => ({
    id,
    title,
    content: (
      <ul className={styles.lines}>
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    ),
  }));

  return (
    <>
      {items.length > 0 && <Accordion items={accordionItems} className={styles.accordion} />}
      {showDescription && <p className={styles.description}>{product.description.trim()}</p>}
    </>
  );
}
