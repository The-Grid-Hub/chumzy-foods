# Local Development Setup

## Prerequisites

- **Node.js** (with npm)

## Start the storefront

```bash
cd web
npm install
npm run dev            # http://localhost:3000
```

Open **http://localhost:3000**. No database, env file, or API server is required.

## Product images

Place photos in `web/public/products/` using the slug filenames listed in the
[README](../README.md#product-images). Restart is not needed — Next.js serves
`public/` as static files. If a file is missing, the product card shows a placeholder.

To add or change a product, edit [`web/lib/products.ts`](../web/lib/products.ts).

## Useful commands

Run from `web/`:

| Command | What it does |
|---------|--------------|
| `npm run lint` | Lint the frontend |
| `npm run build` | Production build / typecheck |
| `npm run start` | Serve the production build |
