import {
  AccordionDemo,
  CaretDemo,
  ContentBlocksDemo,
  DataTableDemo,
  DrawerDemo,
  RichTextDemo,
  QuantityStepperDemo,
  BagItemDemo,
  BagSummaryDemo,
  BagEmptyDemo,
  PreviewFrame,
} from './demos';

// THE place to document the UI. Every file in src/components must have an entry here
// (registry.test.js fails otherwise). Add an entry whenever you build a new component or page pattern:
//   id, group, name, source (path from src/), description, props, usage, Demo.
export const GROUPS = ['UI components', 'Layout components', 'Product components', 'Bag components', 'Page patterns'];

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
      { name: 'onChange', type: '(id | null) => void', description: 'Optional. Called with the open item id after every toggle, null when it closes.' },
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

  {
    id: 'search-field',
    group: 'UI components',
    name: 'SearchField',
    source: 'components/search/SearchField.jsx',
    description:
      'Bare uppercase search input. The bar variant (desktop) adds VIEW ALL RESULTS and CLEAR once there is a term; the strip variant (mobile) adds ENTER.',
    props: [
      { name: 'variant', type: "'bar' | 'strip'", description: 'Which actions to show.' },
      { name: 'value', type: 'string', description: 'Current term.' },
      { name: 'onChange', type: '(value) => void', description: 'Called on every keystroke.' },
      { name: 'onSubmit', type: '(term) => void', description: 'Called with the trimmed term. Not called for a blank term.' },
      { name: 'onClear', type: '() => void', description: 'Bar variant: CLEAR was pressed.' },
      { name: 'showEnter', type: 'boolean', description: 'Strip variant: show ENTER. Default true.' },
    ],
    usage: `<SearchField variant="strip" value={term} onChange={setTerm} onSubmit={go} onClear={clear} />`,
    Demo: frame('/search?q=tee', 520),
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
      { name: 'region', type: '{ label, mobileLabel, ...CountrySelectModal copy }', description: 'Region switcher labels and country modal content (optional).' },
    ],
    usage: `<Header nav={nav} siteName="Streetnut" announcement="..." region={region} />`,
    Demo: frame('/', 560),
  },
  {
    id: 'country-select-modal',
    group: 'Layout components',
    name: 'CountrySelectModal',
    source: 'components/layout/CountrySelectModal.jsx',
    description:
      'Centred "you are shipping to" dialog opened from the US / $ nav button (desktop side nav and mobile drawer). UI only: Save closes it, the choice is not stored yet. Locks page scroll. Clicking the overlay does not close it; Save, Escape and the X (desktop) do.',
    props: [
      { name: 'open', type: 'boolean', description: 'Whether the dialog is shown.' },
      { name: 'onClose', type: '() => void', description: 'Called on Save, X and Escape.' },
      {
        name: 'region',
        type: '{ title, prompt, save, selected, countries: { code, name, currency }[] }',
        description: 'Copy and country list from the site service.',
      },
    ],
    usage: `<CountrySelectModal open={open} onClose={() => setOpen(false)} region={site.region} />`,
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
    description:
      'Desktop (1025px and up): copyright pinned bottom-left. Below 1025px: a static block under the page content with a newsletter row (NEWSLETTER * field and an arrow button, UI only, nothing is sent) and the copyright row, 109.8px tall as on the reference.',
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

  {
    id: 'search-bar',
    group: 'Layout components',
    name: 'SearchBar',
    source: 'components/search/SearchBar.jsx',
    description:
      'Header search. Desktop (1025px and up): a white bar over the header with a live results panel under it. Mobile: a 52px strip under the header with a full-width results panel. Closes with CLOSE, a click outside, a route change, or ESC (mobile). Open the preview and press SEARCH.',
    props: [
      { name: 'open', type: 'boolean', description: 'Open state, owned by Header.' },
      { name: 'persistent', type: 'boolean', description: 'True on /search: the desktop field stays visible with the page term.' },
      { name: 'initialTerm', type: 'string', description: 'Term to show when closed or persistent.' },
      { name: 'focusKey', type: 'number', description: 'Change it to focus the field.' },
      { name: 'onClose', type: '() => void', description: 'Click outside, or ESC on mobile.' },
    ],
    usage: `<SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />`,
    Demo: frame('/', 700),
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
      'Full-width black ADD TO BAG button, 35px high (24px below the colour row on mobile, 16px on desktop). Disabled at half opacity. On the product page it opens the bag drawer; adding the real item is connected by the backend developer later.',
    props: [
      { name: 'disabled', type: 'boolean', description: 'True until a size is chosen (when the product has sizes).' },
      { name: 'onClick', type: '() => void', description: 'Optional. The product page passes openBag.' },
    ],
    usage: `<AddToBag disabled={!size} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'size-chart',
    group: 'Product components',
    name: 'SizeChart',
    source: 'components/product/SizeChart.jsx',
    description:
      'Size guide content inside the product page accordion: plain uppercase notes, an INCHES | CM toggle (underlined = active, other grey, shown only with two or more units), a compact table with the size row as header and grey values, and an optional garment diagram. The table scrolls sideways inside the column when it is too wide and is keyboard-focusable. Renders nothing without a unit.',
    props: [
      {
        name: 'chart',
        type: '{ notes?: string[], units: { id, label, rows: string[][] }[], image?: string, imageSize?: [number, number], imageAlt?: string }',
        description: 'From getSizeChart. rows[0] is the header (Size, XS, S...); the first cell of every row is its label.',
      },
    ],
    usage: `<SizeChart chart={charts.tops} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'product-info',
    group: 'Product components',
    name: 'ProductInfo',
    source: 'components/product/ProductInfo.jsx',
    description:
      'Expandable rows (Product details, Size guide, Shipping & returns, ...) from product.info in the order written, then a CHAT line and a note. A row is text lines or a size chart table. Entries without text, or naming a chart that does not exist, are skipped. The note is the site-wide one unless the product has its own description. Renders nothing when there is nothing to show.',
    props: [
      { name: 'product', type: '{ description?, info?: ({ title, body: string | string[] } | { title, sizeChart: string })[] }', description: 'From productService.' },
      { name: 'charts', type: '{ [key]: block[] }', description: 'Size charts the page loaded with getSizeChart, by key.' },
      { name: 'chat', type: 'string', description: 'Label of the CHAT line (site.json). Hidden when empty. No action yet.' },
      { name: 'note', type: 'string', description: 'Site-wide note under CHAT (site.json productNote). Replaced by product.description when present.' },
      { name: 'scrollRef', type: 'React ref', description: 'The info column when it scrolls on its own (desktop). Opening a row smoothly scrolls the column so that row sits at its top.' },
    ],
    usage: `<ProductInfo product={product} charts={charts} chat={site.chat} note={site.productNote} />`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },

  {
    id: 'search-results',
    group: 'Product components',
    name: 'SearchResults',
    source: 'components/search/SearchResults.jsx',
    description:
      'Search results grid (four columns from 1025px, two below), or a "No results for" line once the lookup settled with nothing.',
    props: [
      { name: 'term', type: 'string', description: 'Trimmed term.' },
      { name: 'items', type: 'product[]', description: 'Matches from searchProducts.' },
      { name: 'settled', type: 'boolean', description: 'False while a lookup for this term is pending.' },
    ],
    usage: `<SearchResults term="tee" items={items} settled />`,
    Demo: frame('/search?q=tee', 800),
  },
  // ---- Bag components ----
  {
    id: 'bag-drawer',
    group: 'Bag components',
    name: 'BagDrawer',
    source: 'components/bag/BagDrawer.jsx',
    description:
      'The shopping bag. Right-side panel opened by BAG in the header or ADD TO BAG on the product page; a white 50% overlay covers the page, scroll is locked, Escape / overlay / CLOSE close it and focus returns to the opener. Width 100% below 744, 67.5vw at 744-1024, 40vw from 1025. Empty state: message + CONTINUE SHOPPING. Filled state: lines, summary, CHECKOUT. Reads everything from useBag(); mounted once in Layout. Click BAG in the preview to open it.',
    props: [],
    usage: `<BagProvider><BagDrawer /></BagProvider>`,
    Demo: frame('/products/fresh-foils-tee-black', 900),
  },
  {
    id: 'bag-item',
    group: 'Bag components',
    name: 'BagItem',
    source: 'components/bag/BagItem.jsx',
    description:
      'One bag line: image (links to the product), title, colour / size, price, quantity stepper. No remove button: quantity 0 removes the line. Image 120x150 below 744, 175x218.8 from 744.',
    props: [
      { name: 'item', type: '{ id, slug, name, color?, size?, price, currency, image, quantity }', description: 'A line from bagService / useBag().' },
      { name: 'onQuantityChange', type: '(qty) => void', description: 'Called with the new quantity (0 = remove).' },
      { name: 'onNavigate', type: '() => void', description: 'Called when the image link is followed (the drawer closes).' },
    ],
    usage: `<BagItem item={item} onQuantityChange={(q) => setQuantity(item.id, q)} />`,
    Demo: BagItemDemo,
  },
  {
    id: 'quantity-stepper',
    group: 'Bag components',
    name: 'QuantityStepper',
    source: 'components/bag/QuantityStepper.jsx',
    description:
      '- / value / + control. Cells are 20x14 from 1025 and 16x30 (gap 4) below. The value is read-only; the buttons ask for value -/+ 1 and the parent decides what to do with it.',
    props: [
      { name: 'value', type: 'number', description: 'Current quantity.' },
      { name: 'onChange', type: '(next: number) => void', description: 'Called with the requested quantity.' },
    ],
    usage: `<QuantityStepper value={qty} onChange={setQty} />`,
    Demo: QuantityStepperDemo,
  },
  {
    id: 'bag-summary',
    group: 'Bag components',
    name: 'BagSummary',
    source: 'components/bag/BagSummary.jsx',
    description:
      'Tax note, shipping note and a SUBTOTAL row (label left, amount right). Notes that are missing leave no gap.',
    props: [
      { name: 'subtotal', type: 'number', description: 'Sum of price x quantity.' },
      { name: 'currency', type: 'string', description: 'ISO currency code.' },
      { name: 'taxNote', type: 'string', description: 'Optional. From bagService.getBagInfo().' },
      { name: 'shippingNote', type: 'string', description: 'Optional. From bagService.getBagInfo().' },
    ],
    usage: `<BagSummary subtotal={90} currency="EUR" taxNote={info.taxNote} />`,
    Demo: BagSummaryDemo,
  },
  {
    id: 'bag-empty',
    group: 'Bag components',
    name: 'BagEmpty',
    source: 'components/bag/BagEmpty.jsx',
    description:
      'Empty-bag text: the message, a blank line, then the shipping note. Renders nothing visible without text.',
    props: [
      { name: 'message', type: 'string', description: 'Optional. From bagService.getBagInfo().' },
      { name: 'shippingNote', type: 'string', description: 'Optional.' },
    ],
    usage: `<BagEmpty message={info.emptyMessage} shippingNote={info.shippingNote} />`,
    Demo: BagEmptyDemo,
  },

  // ---- Page patterns ----
  {
    id: 'page-home',
    group: 'Page patterns',
    name: 'Home',
    source: 'pages/Home.jsx',
    description: 'Home page. Shows the hero video from homeService.getHomeContent(). Featured products and full footer are not built yet.',
    props: [],
    usage: `<Route index element={<Home />} />`,
    Demo: frame('/', 700),
  },
  {
    id: 'hero-media',
    group: 'Page patterns',
    name: 'HeroMedia',
    source: 'components/home/HeroMedia.jsx',
    description:
      'Home hero. A centred muted, looping, autoplaying inline video. Frame ratio 0.663, centred in the viewport (the page grows when the frame is taller). Width is calc(40vw - 8px) from 1025px and calc(95vw - 19px) below, as measured on the reference. Falls back to the poster image, or an empty black frame, when there is no videoSrc. Swap the file at public/videos/hero.mp4 (or change home.json) to change the video.',
    props: [
      { name: 'videoSrc', type: 'string', description: 'Video URL (mp4). Optional.' },
      { name: 'poster', type: 'string', description: 'Image shown before the video plays, or alone when there is no video. Optional.' },
      { name: 'alt', type: 'string', description: 'Accessible label for the video or image.' },
    ],
    usage: `<HeroMedia videoSrc="/videos/hero.mp4" poster="/hero.jpg" alt="Hero film" />`,
    Demo: frame('/', 700),
  },
  {
    id: 'page-product',
    group: 'Page patterns',
    name: 'Product page',
    source: 'pages/Product.jsx',
    description:
      'One page for every product at /products/:slug. Shows only the sections the product has data for: gallery, colour name, badge, sizes, colour thumbnails, add to bag, detail accordions, description. Unknown slug shows the not found page. Desktop: gallery left, sticky info column right (325px wide) that scrolls on its own, separate from the photos; opening a row scrolls it to the top of that column. Mobile: slider on top, info below, one page scroll.',
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
  {
    id: 'page-search',
    group: 'Page patterns',
    name: 'Search page',
    source: 'pages/Search.jsx',
    description:
      '/search?q=term. Hidden H1 "Search results for term". Mobile: the field sits under the header (y=89) and the grid starts at y=131. Desktop: the field lives in the header and the grid starts at y=54, x=180.',
    props: [],
    usage: `<Route path="search" element={<Search />} />`,
    Demo: frame('/search?q=tee', 800),
  },
];
