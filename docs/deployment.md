# Deployment

The storefront is a standard Next.js 14 app in `web/`. Deploy it as a Next.js project
(typically [Vercel](https://vercel.com/); [`web/vercel.json`](../web/vercel.json)
sets `"framework": "nextjs"`).

## Build

From `web/`:

```bash
npm install
npm run build
npm run start
```

No environment variables are required. Product photos in `web/public/products/` are
included in the build as static assets.

If the hosting root is the repo root, set the project root / working directory to `web/`.

## Pre-deploy checklist

- [ ] Product copy in `web/lib/products.ts` is current.
- [ ] Photos in `web/public/products/` match each product `imageUrl`.
- [ ] `npm run build` and `npm run lint` succeed in `web/`.
