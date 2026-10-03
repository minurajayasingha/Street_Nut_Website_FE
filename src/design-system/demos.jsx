import { useState } from 'react';
import Accordion from '../components/ui/Accordion';
import Caret from '../components/ui/Caret';
import ContentBlocks from '../components/ui/ContentBlocks';
import DataTable from '../components/ui/DataTable';
import Drawer from '../components/ui/Drawer';
import RichText from '../components/ui/RichText';
import IframeDemo from './IframeDemo';
import styles from './DesignSystemPage.module.css';

// Live demos for components that do not depend on the viewport width.
// Viewport-dependent pieces use <PreviewFrame /> (see registry.jsx).

export function AccordionDemo() {
  return (
    <Accordion
      items={[
        { id: 'a', title: 'How long does shipping take?', content: 'Orders ship within 2 business days.' },
        { id: 'b', title: 'Can I return an item?', content: 'Yes, within 30 days of delivery.' },
        { id: 'c', title: 'Where do you ship?', content: 'Worldwide, with local delivery times.' },
      ]}
    />
  );
}

export function CaretDemo() {
  return (
    <div className={styles.row}>
      <Caret width="7" height="5" />
      <Caret width="14" height="10" />
      <Caret width="28" height="20" />
    </div>
  );
}

export function ContentBlocksDemo() {
  return (
    <ContentBlocks
      blocks={[
        { type: 'subheading', text: 'Subheading' },
        { type: 'text', text: 'A paragraph with **bold**, _italic_ and a [link](/support).' },
        { type: 'list', items: ['First list item', 'Second list item with **bold**'] },
        {
          type: 'table',
          title: 'Table title',
          rows: [
            ['Size', 'S', 'M', 'L'],
            ['Chest (cm)', '97-102', '104-109', '112-117'],
          ],
        },
      ]}
    />
  );
}

export function DataTableDemo() {
  return (
    <DataTable
      title="Body Measurements"
      rows={[
        ['Size', 'XS', 'S', 'M', 'L'],
        ['Chest (cm)', '89-94', '97-102', '104-109', '112-117'],
        ['Waist (cm)', '71-76', '79-84', '86-91', '94-99'],
      ]}
    />
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={styles.demoButton} onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} label="Drawer demo">
        <p>Drawer content. Press Escape or use the button to close.</p>
        <button type="button" className={styles.demoButton} onClick={() => setOpen(false)}>
          Close drawer
        </button>
      </Drawer>
    </>
  );
}

export function RichTextDemo() {
  return (
    <p>
      <RichText text={'**Bold**, _italic_ and a [site link](/support).\nA new line becomes a line break.'} />
    </p>
  );
}

export function PreviewFrame({ path, height }) {
  return <IframeDemo path={path} height={height} />;
}
