import {
  AccordionDemo,
  CaretDemo,
  ContentBlocksDemo,
  DataTableDemo,
  DrawerDemo,
  RichTextDemo,
  PreviewFrame,
} from './demos';

// THE place to document the UI. Every file in src/components must have an entry here
// (registry.test.js fails otherwise). Add an entry whenever you build a new component or page pattern:
//   id, group, name, source (path from src/), description, props, usage, Demo.
export const GROUPS = ['UI components', 'Layout components', 'Product components', 'Page patterns'];

const frame = (path, height) =>
  function Frame() {
    return <PreviewFrame path={path} height={height} />;
  };

export const registry = [
  // ---- UI components ----
  {
    id: 'accordion',
    group: 'UI components',
    name: 'Accordion',
    source: 'components/ui/Accordion.jsx',
    description: 'Expandable list. One item open at a time; header shows a caret that flips when open.',
    props: [
      { name: 'items', type: '{ id, title, content }[]', description: 'Rows to render.' },
      { name: 'className', type: 'string', description: 'Optional wrapper class.' },
    ],
    usage: `<Accordion items={[{ id: 'a', title: 'Question', content: 'Answer' }]} />`,
    Demo: AccordionDemo,
  },
  {
    id: 'caret',
    group: 'UI components',
    name: 'Caret',
    source: 'components/ui/Caret.jsx',
    description: 'Small chevron icon (SVG) that inherits the text colour. Rotated with CSS by its parent.',
    props: [
      { name: 'width', type: 'string | number', description: 'Rendered width.' },
      { name: 'height', type: 'string | number', description: 'Rendered height.' },
      { name: 'className', type: 'string', description: 'Used to rotate or colour it.' },
    ],
    usage: `<Caret width="7" height="5" />`,
    Demo: CaretDemo,
  },
  {
    id: 'content-blocks',
    group: 'UI components',
    name: 'ContentBlocks',
    source: 'components/ui/ContentBlocks.jsx',
    description:
      'Renders CMS-style content: text, list, subheading and table blocks. Text supports RichText markup.',
    props: [
      { name: 'blocks', type: "{ type: 'text' | 'list' | 'subheading' | 'table', ... }[]", description: 'Block data from a page service.' },
      { name: 'className', type: 'string', description: 'Optional wrapper class.' },
    ],
    usage: `<ContentBlocks blocks={page.blocks} />`,
    Demo: ContentBlocksDemo,
  },
  {
    id: 'data-table',
    group: 'UI components',
    name: 'DataTable',
    source: 'components/ui/DataTable.jsx',
    description: 'Size-guide style table. Underlined title row, first column is the row label.',
    props: [
      { name: 'title', type: 'string', description: 'Table title (also the aria-label).' },
      { name: 'rows', type: 'string[][]', description: 'First row sets the column count; first cell of each row is the label.' },
    ],
    usage: `<DataTable title="Sizes" rows={[['Size', 'S', 'M'], ['Chest', '38', '40']]} />`,
    Demo: DataTableDemo,
  },
  {
    id: 'drawer',
    group: 'UI components',
    name: 'Drawer',
    source: 'components/ui/Drawer.jsx',
    description:
      'Full-width panel that sits under the header (mobile menu). Locks page scroll while open; Escape closes it.',
    props: [
      { name: 'open', type: 'boolean', description: 'Whether the panel is shown.' },
      { name: 'onClose', type: '() => void', description: 'Called on Escape.' },
      { name: 'label', type: 'string', description: 'aria-label for the dialog.' },
    ],
    usage: `<Drawer open={open} onClose={() => setOpen(false)} label="Menu">...</Drawer>`,
    Demo: DrawerDemo,
  },
  {
    id: 'placeholder-page',
    group: 'UI components',
    name: 'PlaceholderPage',
    source: 'components/ui/PlaceholderPage.jsx',
    description: 'Centered title used for pages that are not built yet (Archive, Chapters).',
    props: [
      { name: 'title', type: 'string', description: 'Page title.' },
      { name: 'tone', type: 'string', description: 'Optional data-tone styling hook.' },
    ],
    usage: `<PlaceholderPage title="Archive" />`,
    Demo: frame('/archive', 360),
  },
  {
    id: 'rich-text',
    group: 'UI components',
    name: 'RichText',
    source: 'components/ui/RichText.jsx',
    description:
      'Inline markup for content strings: **bold**, _italic_, [label](href) and newlines. Only safe links render.',
    props: [{ name: 'text', type: 'string', description: 'Content string with the markup above.' }],
    usage: `<RichText text="**Bold** and a [link](/support)" />`,
    Demo: RichTextDemo,
  },

  // ---- Layout components ----
  {
    id: 'layout',
    group: 'Layout components',
    name: 'Layout',
    source: 'components/layout/Layout.jsx',
    description: 'App shell: loads site info and navigation, renders Header, the routed page and Footer.',
    props: [],
    usage: `<Route element={<Layout />}>...</Route>`,
    Demo: frame('/', 560),
  },
  {
    id: 'header',
    group: 'Layout components',
    name: 'Header',
    source: 'components/layout/Header.jsx',
    description:
      'Fixed header. Desktop (1025px and up): logo, left side nav, announcement, SEARCH and BAG. Mobile: logo, SEARCH, BAG and MENU with a drawer.',
    props: [
      { name: 'nav', type: '{ primary, secondary }', description: 'Navigation groups from navigationService.' },
      { name: 'siteName', type: 'string', description: 'Logo alt text.' },
      { name: 'announcement', type: 'string', description: 'Text for the announcement bar.' },
      { name: 'region', type: '{ label, mobileLabel }', description: 'Region switcher label (optional).' },
    ],
    usage: `<Header nav={nav} siteName="Streetnut" announcement="..." region={region} />`,
    Demo: frame('/', 560),
  },
  {
    id: 'announcement-bar',
    group: 'Layout components',
    name: 'AnnouncementBar',
    source: 'components/layout/AnnouncementBar.jsx',
    description: 'Centered desktop notice with a HIDE button. Hidden below 1025px, as on the reference.',
    props: [{ name: 'text', type: 'string', description: 'Message. Nothing renders when empty.' }],
    usage: `<AnnouncementBar text="Free shipping" />`,
    Demo: frame('/', 200),
  },
  {
    id: 'footer',
    group: 'Layout components',
    name: 'Footer',
    source: 'components/layout/Footer.jsx',
    description: 'Copyright line pinned bottom-left on desktop; hidden on mobile.',
    props: [{ name: 'siteName', type: 'string', description: 'Shown after the copyright year.' }],
    usage: `<Footer siteName="Streetnut" />`,
    Demo: frame('/', 560),
  },
  {
    id: 'page-container',
    group: 'Layout components',
    name: 'PageContainer',
    source: 'components/layout/PageContainer.jsx',
    description: 'Content column used by text pages (180px left / 20vw right on desktop). Also exports PageTitle.',
    props: [
      { name: 'flushTablet', type: 'boolean', description: 'Remove the side padding at tablet widths.' },
      { name: 'className', type: 'string', description: 'Optional extra class.' },
    ],
    usage: `<PageContainer><PageTitle>Title</PageTitle>...</PageContainer>`,
    Demo: frame('/support/warranty', 520),
  },
  {
    id: 'policy-page',
    group: 'Layout components',
    name: 'PolicyPage',
    source: 'components/layout/PolicyPage.jsx',
    description: 'Long policy page made of titled sections (Shipping & returns).',
    props: [{ name: 'page', type: '{ title, sections: { id, title, blocks }[] }', description: 'Page data from pageService.' }],
    usage: `<PolicyPage page={data} />`,
    Demo: frame('/support/shipping-returns', 560),
  },
  {
    id: 'text-page',
    group: 'Layout components',
    name: 'TextPage',
    source: 'components/layout/TextPage.jsx',
    description: 'Simple page: a title plus ContentBlocks (Warranty, Size guide, Accessibility).',
    props: [
      { name: 'page', type: '{ title, blocks }', description: 'Page data from pageService.' },
      { name: 'lineHeight', type: "'rte' | 'prose'", description: "Line height variant. Default 'rte'." },
    ],
    usage: `<TextPage page={data} lineHeight="prose" />`,
    Demo: frame('/support/warranty', 520),
  },

  // ---- Product components ----
  {
    id: 'product-card',
    group: 'Product components',
    name: 'ProductCard',
    source: 'components/product/ProductCard.jsx',
    description:
      'Product tile with three states. Default: image, name, price and a size row that fades in on hover (desktop). One-size: same, but the size row stays empty. Sold out: image at 50%, SOLD OUT replaces the price, no sizes. A second image swaps in on hover on desktop and is a swipeable slide on mobile. Badge or colour count shows in a small grey note.',
    props: [
      {
        name: 'product',
        type: '{ slug, name, price, currency, family?, color?, collections?, images?, image?, sizes?, soldOut?, badge?, colors? }',
        description: 'From productService. State is derived by utils/productState: soldOut flag or every size unavailable is sold out; no sizes or a single "One size" is one-size. A product with a colour names it in the link, image alt and size-link labels (not visibly).',
      },
    ],
    usage: `<ProductCard product={product} />`,
    Demo: frame('/collections/all', 760),
  },
  {
    id: 'size-list',
    group: 'Product components',
    name: 'SizeList',
    source: 'components/product/SizeList.jsx',
    description:
      'Reserved size row under a card. Available sizes link to /products/:slug?size=; unavailable sizes are grey text with aria-disabled. Hidden below 1025px. Visibility follows the --sizes-opacity custom property set by the card.',
    props: [
      { name: 'slug', type: 'string', description: 'Product slug used in the size links.' },
      { name: 'name', type: 'string', description: 'Product name used in the link aria-labels.' },
      { name: 'sizes', type: '{ label, available }[]', description: 'Empty renders the reserved row with nothing in it.' },
    ],
    usage: `<SizeList slug="brush-logo-tee" name="Brush Logo Tee" sizes={product.sizes} />`,
    Demo: frame('/collections/all', 760),
  },
  {
    id: 'product-grid',
    group: 'Product components',
    name: 'ProductGrid',
    source: 'components/product/ProductGrid.jsx',
    description:
      'Collection grid: 2 columns (5px gap) on mobile, flush at tablet from 744px, 2 columns with 20px gap from 1025px, 4 columns with 5px gap from 1201px. Includes the measured page gutters.',
    props: [
      { name: 'products', type: 'product[]', description: 'Products from productService. Defaults to an empty list.' },
      { name: 'label', type: 'string', description: "aria-label of the list. Default 'Products'." },
    ],
    usage: `<ProductGrid products={products} />`,
    Demo: frame('/collections/all', 760),
  },
  {
    id: 'product-gallery',
    group: 'Product components',
    name: 'ProductGallery',
    source: 'components/product/ProductGallery.jsx',
    description:
      'Product page images. Mobile: full-width 4:5 swipeable slider. Desktop (from 1025px): the same images stacked in the left column with a 10px gap. Renders nothing when the product has no images.',
    props: [
      { name: 'images', type: 'string[]', description: 'Image paths in order. Blank entries are skipped.' },
      { name: 'label', type: 'string', description: 'Product name (with colour) used in the alt texts.' },
    ],
    usage: `<ProductGallery images={product.images} label="Black Fresh Foils Tee" />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'color-switch',
    group: 'Product components',
    name: 'ColorSwitch',
    source: 'components/product/ColorSwitch.jsx',
    description:
      'Row of 45x56 colour thumbnails (16px gap) linking to the other colours of a product family. The current colour has a black border. Renders nothing unless two or more colours exist.',
    props: [
      { name: 'products', type: 'product[]', description: 'Every colour of the family, from getProductFamily.' },
      { name: 'currentSlug', type: 'string', description: 'Slug of the product being viewed.' },
    ],
    usage: `<ColorSwitch products={family} currentSlug={product.slug} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'size-picker',
    group: 'Product components',
    name: 'SizePicker',
    source: 'components/product/SizePicker.jsx',
    description:
      'Size selector for the product page (radio group). Selected size is underlined; unavailable sizes are grey, struck through and not selectable. Renders nothing without sizes. Not the same as SizeList, which is the hover row on cards.',
    props: [
      { name: 'sizes', type: '{ label, available }[]', description: 'From productService.' },
      { name: 'value', type: 'string | null', description: 'Selected size label.' },
      { name: 'onChange', type: '(label) => void', description: 'Called with the picked size.' },
    ],
    usage: `<SizePicker sizes={product.sizes} value={size} onChange={setSize} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'add-to-bag',
    group: 'Product components',
    name: 'AddToBag',
    source: 'components/product/AddToBag.jsx',
    description:
      'Full-width black ADD TO BAG button, 35px high (24px below the colour row on mobile, 16px on desktop). Disabled at half opacity. The bag does not exist yet: the page passes no onClick; the backend developer connects it later.',
    props: [
      { name: 'disabled', type: 'boolean', description: 'True until a size is chosen (when the product has sizes).' },
      { name: 'onClick', type: '() => void', description: 'Optional. Not wired yet.' },
    ],
    usage: `<AddToBag disabled={!size} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'product-info',
    group: 'Product components',
    name: 'ProductInfo',
    source: 'components/product/ProductInfo.jsx',
    description:
      'Expandable detail sections (Product details, Care, Fit, ...) from product.info, then the optional description. Entries without a title or text are skipped. Renders nothing when there is neither.',
    props: [
      { name: 'product', type: '{ description?, info?: { title, body: string | string[] }[] }', description: 'From productService.' },
    ],
    usage: `<ProductInfo product={product} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },

  // ---- Page patterns ----
  {
    id: 'page-home',
    group: 'Page patterns',
    name: 'Home',
    source: 'pages/Home.jsx',
    description: 'Home page (hero in progress).',
    props: [],
    usage: `<Route index element={<Home />} />`,
    Demo: frame('/', 560),
  },
  {
    id: 'page-product',
    group: 'Page patterns',
    name: 'Product page',
    source: 'pages/Product.jsx',
    description:
      'One page for every product at /products/:slug. Shows only the sections the product has data for: gallery, colour name, badge, sizes, colour thumbnails, add to bag, detail accordions, description. Unknown slug shows the not found page. Desktop: gallery left, sticky info column right (325px wide). Mobile: slider on top, info below.',
    props: [],
    usage: `<Route path="products/:slug" element={<Product />} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'page-support',
    group: 'Page patterns',
    name: 'Customer support (FAQ)',
    source: 'pages/Support.jsx',
    description: 'Customer support page with an FAQ accordion.',
    props: [],
    usage: `<Route path="support" element={<Support />} />`,
    Demo: frame('/support', 560),
  },
  {
    id: 'page-legal',
    group: 'Page patterns',
    name: 'Legal',
    source: 'pages/legal/Legal.jsx',
    description: 'Legal pages (terms, privacy, and so on) built from accordion sections.',
    props: [],
    usage: `<Route path="legal" element={<Legal />} />`,
    Demo: frame('/legal', 560),
  },
  {
    id: 'page-shipping-returns',
    group: 'Page patterns',
    name: 'Shipping and returns',
    source: 'pages/support/ShippingReturns.jsx',
    description: 'Policy page using PolicyPage.',
    props: [],
    usage: `<Route path="shipping-returns" element={<ShippingReturns />} />`,
    Demo: frame('/support/shipping-returns', 560),
  },
  {
    id: 'page-size-guide',
    group: 'Page patterns',
    name: 'Size guide',
    source: 'pages/support/SizeGuide.jsx',
    description: 'Text page with DataTable size tables.',
    props: [],
    usage: `<Route path="size-guide" element={<SizeGuide />} />`,
    Demo: frame('/support/size-guide', 560),
  },
  {
    id: 'page-warranty',
    group: 'Page patterns',
    name: 'Warranty',
    source: 'pages/support/Warranty.jsx',
    description: 'Text page using TextPage.',
    props: [],
    usage: `<Route path="warranty" element={<Warranty />} />`,
    Demo: frame('/support/warranty', 560),
  },
];
