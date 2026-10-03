# Product data: products, stock and images

All content reaches components through `src/services/productService.js`. The backend developer replaces the service internals with API calls; the shapes below are the contract.

## Products (`src/data/products.json`)

Each colour of a product is its own entry (own slug, own card), linked to its siblings by `family`.

| Field | Meaning |
|---|---|
| `id`, `slug` | Unique. The slug is the URL: `/products/<slug>`. |
| `family` | Shared by every colour of one product (for example `fresh-foils-tee`). The product page will use it to offer the other colours (not built yet). |
| `name`, `color` | `name` is shown on the card; `color` is used for the accessible names, image alt text and size-link labels, and, later, the colour switch on the product page. |
| `price`, `currency` | Number and ISO code (`EUR`). |
| `collections` | Handles this product appears in: `tees`, `knits`, ... `/collections/<handle>` lists them. `/collections/all` lists everything. Handles are lower-case and matched exactly (`/collections/Tees` would show nothing). |
| `images` | `images[0]` is the card image, `images[1]` the hover image (swipe slide on mobile); any further images are reserved for the product page gallery (not built yet). Paths start with `/products/` and match the file names on disk exactly. |
| `sizes` | Only for products without a stock entry: `[{ "label": "S", "available": true }]` (ignored if the slug has an entry in `stock.json`). A single "One size" entry makes a one-size card. |
| `badge`, `colors`, `soldOut` | Optional: grey note on the card, colour count, forced sold-out. |

## Stock (`src/data/stock.json`)

Quantity per size for each slug. Sizes are always `XS, S, M, L, XL, XXL`, in that order.

    "fresh-foils-tee-black": { "XS": 0, "S": 4, "M": 10, "L": 6, "XL": 2, "XXL": 0 }

- More than 0: available (black, clickable). 0 or missing: unavailable (grey, not clickable).
- All sizes 0: the card shows SOLD OUT with no sizes. An empty entry `{}` counts as all sizes 0, so it is also sold out.
- Every product in the `tees` collection needs an entry here, and every key must be a real slug (a test checks both).

## Image folders (`public/products/`)

    public/products/<PRODUCT>/<PRODUCT>-<COLOUR>/1.webp   (card image)
                                                  2.webp   (hover image)
                                                  3.webp   (more, for the product page)

Use 4:5 images (for example 1200x1500). File names are case-sensitive on most hosts.

The current tee photos are local test photos that are not ours: they are git-ignored and must be removed before any deployment.
