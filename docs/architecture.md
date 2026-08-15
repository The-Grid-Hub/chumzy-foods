# Architecture

## Overview

Chumzy Raw Foods is a single Next.js storefront. Product data, reviews, and images
are static. Orders go out over WhatsApp.

```
┌──────────────┐     static files      ┌─────────────────────┐
│ Browser      │  <──────────────────  │ web (Next.js :3000) │
└──────────────┘                       │  lib/products.ts    │
        │                              │  lib/reviews.ts     │
        │  wa.me                       │  public/products/   │
        └────────────────────────────> └─────────────────────┘
```

## Storefront (`web/`)

```
web/
├── app/
│   ├── layout.tsx      # root layout: CartProvider + Header/Footer
│   ├── page.tsx        # home page (composition of sections)
│   ├── cart/page.tsx   # cart & WhatsApp checkout
│   └── globals.css
├── components/
│   ├── layout/         # Header, Footer
│   ├── sections/       # Hero, About, Products, Reviews, BulkOrder, Contact, WhatsAppBanner
│   └── ui/             # ProductCard
├── lib/
│   ├── products.ts       # static product catalog
│   ├── reviews.ts        # static reviews
│   ├── cart-context.tsx  # React Context + useReducer, localStorage-persisted
│   ├── types.ts          # Product, CartItem, Review, BulkOrderForm
│   └── constants.ts      # business info, nav links, categories
└── public/products/      # product photos (slug filenames)
```

- **Pages** are built by composing section components on the home page.
- **Catalog** is imported from [`web/lib/products.ts`](../web/lib/products.ts). Category
  filtering happens in the client. Photos are served from `/products/{slug}.jpg`.
- **Cart state** lives in [`web/lib/cart-context.tsx`](../web/lib/cart-context.tsx): a
  React Context backed by `useReducer`, persisted to `localStorage`. Checkout builds a
  `wa.me` URL with line items and optional delivery details. Pricing is confirmed on
  WhatsApp rather than shown on the site.
- **Reviews** are imported from [`web/lib/reviews.ts`](../web/lib/reviews.ts).
