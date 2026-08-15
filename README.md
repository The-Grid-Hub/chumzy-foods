# Chumzy Raw Foods

A Next.js storefront for **Nigerian raw food materials** — oils, soup ingredients,
grains & cassava, dried fish & seafood, seafood seasonings, and canned goods.
Customers browse a static product catalog and place orders via WhatsApp.

## Tech stack

- [Next.js](https://nextjs.org/) 14 (App Router) + React 18
- Tailwind CSS (custom brand palette)
- Framer Motion (animations), Lucide (icons)
- TypeScript (strict)

The app lives in `web/`. Product copy is in [`web/lib/products.ts`](web/lib/products.ts);
photos go in [`web/public/products/`](web/public/products/).

## Quickstart

> Full step-by-step instructions are in [docs/setup.md](docs/setup.md).

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

## Scripts

Run from `web/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with `next lint` |

## Product images

Drop files into `web/public/products/` using these names (jpg, png, or webp — if you
use a different extension, update `imageUrl` in `web/lib/products.ts`):

- `fresh-palm-oil.jpg`
- `egusi-melon-seeds.jpg`
- `ogbono-wild-mango-seeds.jpg`
- `white-garri.jpg`
- `yellow-garri.jpg`
- `ijabu-garri.jpg`
- `stockfish.jpg`
- `dryfish.jpg`
- `crayfish.jpg`
- `tin-tomatoes.jpg`

Until a file is present, the product card shows a placeholder.

## Documentation

- [CLAUDE.md](CLAUDE.md) — conventions & requirements to check before making a change
- [docs/architecture.md](docs/architecture.md) — app structure
- [docs/setup.md](docs/setup.md) — local development setup
- [docs/deployment.md](docs/deployment.md) — Vercel deploy
