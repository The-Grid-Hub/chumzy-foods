# Database

PostgreSQL accessed through **Drizzle ORM**. The schema is the single source of truth:
[`server/src/db/schema.ts`](../server/src/db/schema.ts). The connection pool and `db`
instance are in [`server/src/db/client.ts`](../server/src/db/client.ts) (uses
`process.env.DATABASE_URL`).

## Enums

### `order_status` (`orderStatusEnum`)
`pending` · `confirmed` · `processing` · `shipped` · `delivered` · `cancelled`

## Tables

### `products`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | PK |
| `name` | text | required |
| `slug` | text | required, **unique** |
| `description` | text | required |
| `category` | text | required |
| `price_ngn` | numeric(12,2) | nullable |
| `price_usd` | numeric(10,2) | nullable |
| `price_gbp` | numeric(10,2) | nullable |
| `packaging_size` | text | required |
| `in_stock` | boolean | default `true` |
| `image_url` | text | nullable |
| `featured` | boolean | default `false` |
| `created_at` / `updated_at` | timestamp | default `now()` |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | PK |
| `customer_name` / `customer_email` / `customer_phone` | text | required |
| `country` / `address` | text | required |
| `total_ngn` | numeric(14,2) | nullable |
| `total_usd` | numeric(10,2) | nullable |
| `total_gbp` | numeric(10,2) | nullable |
| `status` | `order_status` enum | default `pending` |
| `payment_method` | text | required |
| `notes` | text | nullable |
| `created_at` / `updated_at` | timestamp | default `now()` |

### `order_items`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | PK |
| `order_id` | integer | FK → `orders.id`, `onDelete: cascade` |
| `product_id` | integer | FK → `products.id` |
| `product_name` | text | required (denormalized snapshot) |
| `quantity` | integer | required |
| `unit_price` | numeric(10,2) | required |
| `currency` | text | required |

### `bulk_order_requests`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | PK |
| `business_name` | text | nullable |
| `contact_name` / `email` / `phone` / `country` | text | required |
| `product_requests` / `estimated_quantity` | text | required |
| `delivery_timeline` / `additional_notes` | text | nullable |
| `status` | text | default `new` |
| `created_at` | timestamp | default `now()` |

### `reviews`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | PK |
| `customer_name` / `country` | text | required |
| `rating` | integer | required (validated 1–5 in the API) |
| `comment` | text | required |
| `products_purchased` | text | nullable |
| `approved` | boolean | default `false` (moderation gate) |
| `created_at` | timestamp | default `now()` |

### `contact_messages`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | PK |
| `name` / `email` | text | required |
| `phone` | text | nullable |
| `subject` / `message` | text | required |
| `read` | boolean | default `false` |
| `created_at` | timestamp | default `now()` |

## Multi-currency pricing

Products carry independent `price_ngn`, `price_usd`, and `price_gbp` columns; orders carry
matching `total_*` columns, and each `order_items` row records its own `unit_price` +
`currency`. All monetary values are `numeric` and surface as **strings** (or `null`) in
JSON — handle them as strings, not numbers.

## Inferred types

`schema.ts` re-exports Drizzle inferred types — use these instead of hand-writing entity
types on the server:

```ts
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
// ...Order, OrderItem, BulkOrderRequest, Review (+ New* variants)
```

## Migration workflow

Schema-first with drizzle-kit. From `server/`:

1. **Edit** the schema in [`server/src/db/schema.ts`](../server/src/db/schema.ts).
2. **Generate** a migration: `npm run db:generate` → writes SQL to `server/drizzle/`.
3. **Apply** it: `npm run db:migrate`.
4. **Inspect** data if needed: `npm run db:studio` (Drizzle Studio).
5. **Seed**: `npm run db:seed` (runs [`server/src/db/seed.ts`](../server/src/db/seed.ts)).

> **Never edit a migration that has already been generated/applied.** To change the schema,
> edit `schema.ts` and generate a *new* migration. Commit generated migrations to version
> control.
