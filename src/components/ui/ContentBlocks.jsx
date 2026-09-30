import DataTable from './DataTable';
import RichText from './RichText';
import styles from './ContentBlocks.module.css';

function Block({ block }) {
  if (block.type === 'text') {
    return (
      <p>
        <RichText text={block.text} />
      </p>
    );
  }
  if (block.type === 'list') {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === 'subheading') {
    return (
      <h2 className={styles.subheading}>
        <strong>{block.text}</strong>
      </h2>
    );
  }
  if (block.type === 'table') {
    return <DataTable title={block.title} rows={block.rows} />;
  }
  return null;
}

export default function ContentBlocks({ blocks, className }) {
  return (
    <div className={className ? `${styles.blocks} ${className}` : styles.blocks}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
