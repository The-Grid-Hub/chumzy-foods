# API Reference

Base URL: `NEXT_PUBLIC_API_URL` on the client; defaults to `http://localhost:3001`.
All endpoints return JSON. The public storefront endpoints (`/api/products`, `/api/orders`,
`/api/bulk-orders`, `/api/reviews`, `/api/contact`) require **no authentication**.
The admin endpoints under `/api/admin/*` (except `login`) require a Bearer JWT — see
[Admin API](#admin-api--apiadmin) below.
Validation is manual; missing/invalid fields return `400` with `{ "error": "..." }`.

Prices and totals are stored as Postgres `numeric` and serialized as **strings** (or `null`).

## Health

### `GET /health`
Liveness check.

**200**
```json
{ "status": "ok", "service": "chumzy-server" }
```

---

## Products — `/api/products`

### `GET /api/products`
List products. Optional query params (mutually exclusive; `featured` takes precedence):

| Query | Effect |
|-------|--------|
| `featured=true` | Only featured products |
| `category=<name>` | Only products in that category |

**200** — array of product objects:
```json
[
  {
    "id": 1,
    "name": "Palm Oil",
    "slug": "palm-oil",
    "description": "...",
    "category": "Oils",
    "priceNgn": "5000.00",
    "priceUsd": "6.50",
    "priceGbp": "5.10",
    "packagingSize": "1L",
    "inStock": true,
    "imageUrl": "https://...",
    "featured": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### `GET /api/products/:slug`
Fetch a single product by its unique `slug`.

- **200** — the product object (as above).
- **404** — `{ "error": "Product not found" }`.

---

## Orders — `/api/orders`

### `POST /api/orders`
Create an order plus its line items.

**Body**
```json
{
  "customer": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+44 ...",
    "country": "United Kingdom",
    "address": "..."
  },
  "items": [
    {
      "productId": 1,
      "productName": "Palm Oil",
      "quantity": 2,
      "unitPrice": "6.50",
      "currency": "USD"
    }
  ],
  "paymentMethod": "bank-transfer",
  "notes": "optional"
}
```

Required: `customer`, a non-empty `items` array, and `paymentMethod`. The server computes
`totalUsd` from `unitPrice * quantity`; `currency` defaults to `"USD"` when omitted on an item.

- **201** — `{ "orderId": 12, "status": "pending" }`
- **400** — `{ "error": "Missing required fields" }`

### `GET /api/orders/:id`
Fetch an order with its items. `:id` must be an integer.

- **200** — the order object plus an `items` array.
- **400** — `{ "error": "Invalid id" }` (non-numeric id).
- **404** — `{ "error": "Order not found" }`.

---

## Bulk orders — `/api/bulk-orders`

### `POST /api/bulk-orders`
Submit a B2B bulk-order inquiry.

**Body**
```json
{
  "businessName": "optional",
  "contactName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+44 ...",
  "country": "United Kingdom",
  "productRequests": "Palm oil, dried fish ...",
  "estimatedQuantity": "50 cartons",
  "deliveryTimeline": "optional",
  "additionalNotes": "optional"
}
```

Required: `contactName`, `email`, `phone`, `country`, `productRequests`, `estimatedQuantity`.

- **201** — `{ "id": 3, "message": "Bulk order request submitted successfully" }`
- **400** — `{ "error": "Missing required fields" }`

---

## Reviews — `/api/reviews`

### `GET /api/reviews`
List **approved** reviews only.

**200** — array of review objects:
```json
[
  {
    "id": 1,
    "customerName": "Jane Doe",
    "country": "United Kingdom",
    "rating": 5,
    "comment": "...",
    "productsPurchased": "Palm oil",
    "approved": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### `POST /api/reviews`
Submit a review. New reviews are created with `approved: false` (pending moderation).

**Body**
```json
{
  "customerName": "Jane Doe",
  "country": "United Kingdom",
  "rating": 5,
  "comment": "...",
  "productsPurchased": "optional"
}
```

Required: `customerName`, `country`, `rating`, `comment`. `rating` must be **1–5**.

- **201** — `{ "id": 7, "message": "Review submitted and pending approval" }`
- **400** — `{ "error": "Missing required fields" }` or `{ "error": "Rating must be between 1 and 5" }`

---

## Contact — `/api/contact`

### `POST /api/contact`
Submit a contact-form message.

**Body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "optional",
  "subject": "Wholesale enquiry",
  "message": "..."
}
```

Required: `name`, `email`, `subject`, `message`.

- **201** — `{ "id": 4, "message": "Message received. We will get back to you soon!" }`
- **400** — `{ "error": "Missing required fields" }`

---

## Admin API — `/api/admin`

All admin endpoints **except `login`** require an `Authorization: Bearer <token>` header.
Missing/invalid tokens return **401**. The token is a JWT issued by `POST /api/admin/login`
and signed with `JWT_SECRET` (7-day expiry); its payload carries the admin's `sub` (id),
`email`, and `role`. Admin credentials live in the `admin_users` table (email +
bcrypt-hashed password); the initial admin is seeded from the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` env vars via `npm run db:seed`. CORS additionally allows the `ADMIN_URL`
origin (default `http://localhost:3002`).

### `POST /api/admin/login`
Exchange admin email + password for a JWT. Public. Credentials are verified against the
`admin_users` table.

**Body** — `{ "email": "...", "password": "..." }` (both required)

- **200** — `{ "token": "<jwt>" }`
- **400** — `{ "error": "Missing required fields" }`
- **401** — `{ "error": "Invalid credentials" }`

### Products — `/api/admin/products`
- `GET /` — list **all** products (incl. out-of-stock / unfeatured), newest first.
- `POST /` — create a product. Required: `name`, `slug`, `description`, `category`,
  `packagingSize`. Optional: `priceNgn`, `priceUsd`, `priceGbp` (strings), `inStock`,
  `imageUrl`, `featured`. **201** with the created product; **409** on duplicate `slug`.
- `PUT /:id` — partial update (any subset of the create fields); refreshes `updatedAt`.
  **404** if not found; **409** on duplicate `slug`.
- `DELETE /:id` — delete. **404** if not found; **409** if referenced by an order.

### Orders — `/api/admin/orders`
- `GET /` — list orders newest first; optional `?status=<order_status>` filter.
- `GET /:id` — order plus its `items`.
- `PATCH /:id/status` — body `{ "status": "<order_status>" }` where status is one of
  `pending|confirmed|processing|shipped|delivered|cancelled`. **400** on invalid status.

### Reviews — `/api/admin/reviews`
- `GET /` — list **all** reviews (approved + pending), newest first.
- `PATCH /:id` — body `{ "approved": true|false }`.
- `DELETE /:id`.

### Bulk Orders — `/api/admin/bulk-orders`
- `GET /` — list all requests, newest first.
- `PATCH /:id/status` — body `{ "status": "new"|"contacted"|"closed" }`.
- `DELETE /:id`.

### Contact Messages — `/api/admin/contact`
- `GET /` — list all messages, newest first.
- `PATCH /:id/read` — body `{ "read": true|false }`.
- `DELETE /:id`.

### Dashboard — `/api/admin/stats`
- `GET /` — counts for the dashboard:
```json
{
  "products": 24,
  "orders": { "total": 12, "byStatus": { "pending": 3, "delivered": 9 } },
  "pendingReviews": 2,
  "unreadMessages": 5,
  "newBulkRequests": 1
}
```
