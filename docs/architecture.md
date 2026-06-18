# Architecture

## Overview

Chumzy Raw Foods is a monorepo with two independent packages that talk over HTTP:

```
                 fetch  NEXT_PUBLIC_API_URL/api/*
┌──────────────┐  ───────────────────────────────>  ┌──────────────┐  Drizzle   ┌────────────┐
│ web          │                                     │ server       │  ───────>  │ PostgreSQL │
│ Next.js :3000│  <───────────────────────────────   │ Hono   :3001 │  <───────  │            │
└──────────────┘            JSON responses           └──────────────┘            └────────────┘
```

There is no shared package or workspace config — each side installs and runs on its own.
The only contract between them is the JSON shape of the `/api/*` endpoints, mirrored on
the frontend in [`web/lib/types.ts`](../web/lib/types.ts).

## Backend (`server/`)

```
server/src/
├── index.ts            # app entry: middleware, /health, route mounting
├── db/
│   ├── client.ts       # pg Pool + Drizzle db instance
│   ├── schema.ts       # table definitions + inferred types
│   └── seed.ts         # seed script
└── routes/
    ├── products.ts     # GET /  (featured/category filters), GET /:slug
    ├── orders.ts       # POST / (create order + items), GET /:id
    ├── bulk-orders.ts  # POST /  (submit bulk request)
    ├── reviews.ts      # GET /  (approved only), POST /
    └── contact.ts      # POST /  (submit message)
```

### Request flow

1. [`index.ts`](../server/src/index.ts) creates the Hono app and applies, in order:
   - `dotenv/config` (loads env vars),
   - `logger()` middleware,
   - `cors()` middleware whose `origin` is `process.env.FRONTEND_URL` (default
     `http://localhost:3000`).
2. A `GET /health` endpoint returns `{ status: 'ok', service: 'chumzy-server' }`.
3. Five routers are mounted under `/api`:
   - `/api/products` → `routes/products.ts`
   - `/api/orders` → `routes/orders.ts`
   - `/api/bulk-orders` → `routes/bulk-orders.ts`
   - `/api/reviews` → `routes/reviews.ts`
   - `/api/contact` → `routes/contact.ts`
4. Each handler validates input manually (returning `400` on missing/invalid fields),
   runs Drizzle queries against the shared `db` from [`db/client.ts`](../server/src/db/client.ts),
   and returns JSON.

> **Note on imports:** the server uses NodeNext module resolution, so local imports carry
> a `.js` extension even though the files are `.ts` (e.g. `import { db } from '../db/client.js'`).

## Frontend (`web/`)

```
web/
├── app/
│   ├── layout.tsx      # root layout: CartProvider + Header/Footer
│   ├── page.tsx        # home page (composition of sections)
│   ├── cart/page.tsx   # cart & checkout
│   └── globals.css
├── components/
│   ├── layout/         # Header, Footer
│   ├── sections/       # Hero, About, Products, Reviews, BulkOrder, Contact, WhatsAppBanner
│   └── ui/             # ProductCard
└── lib/
    ├── cart-context.tsx  # React Context + useReducer, localStorage-persisted
    ├── types.ts          # shared interfaces (Product, CartItem, Review, ...)
    └── constants.ts      # API_BASE, business info, nav links, categories, currencies
```

- **Pages** are built by composing section components on the home page.
- **Cart state** lives in [`web/lib/cart-context.tsx`](../web/lib/cart-context.tsx): a
  React Context backed by `useReducer`, persisted to `localStorage`. It also tracks the
  active currency (NGN / USD / GBP).
- **Data fetching** uses `API_BASE` from [`web/lib/constants.ts`](../web/lib/constants.ts)
  (`process.env.NEXT_PUBLIC_API_URL`, default `http://localhost:3001`) to call `/api/*`.

## The frontend ↔ backend contract

The two packages are kept in sync by convention, not tooling. When an endpoint's request
or response shape changes:

1. Update the interface in [`web/lib/types.ts`](../web/lib/types.ts).
2. Update any endpoint/config in [`web/lib/constants.ts`](../web/lib/constants.ts).
3. Update the consuming section/component in [`web/components/`](../web/components/).
4. Update [`api-reference.md`](api-reference.md).

A subtle detail: prices and totals are Postgres `numeric` and arrive as **strings** (or
`null`) in JSON — `web/lib/types.ts` types them as `string | null` accordingly.
