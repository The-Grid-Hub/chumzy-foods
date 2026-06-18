# Chumzy Raw Foods

A full-stack e-commerce platform for **Nigerian raw food materials** — oils, soup
ingredients, grains & cassava, dried fish & seafood, seafood seasonings, and canned
goods. Customers browse a product catalog with multi-currency pricing (NGN / USD / GBP),
add items to a cart, request bulk orders, leave reviews, and get in touch via a contact
form or WhatsApp.

## Tech stack

**Backend** (`server/`)
- [Hono](https://hono.dev/) 4 on `@hono/node-server`
- PostgreSQL via `pg`
- [Drizzle ORM](https://orm.drizzle.team/) + drizzle-kit (schema-first, migrations)
- TypeScript (strict, ES2022, NodeNext)

**Storefront** (`web/`)
- [Next.js](https://nextjs.org/) 14 (App Router) + React 18
- Tailwind CSS (custom brand palette)
- Framer Motion (animations), Lucide (icons)
- TypeScript (strict)

**Admin dashboard** (`admin/`)
- Next.js 14 (App Router) + React 18, Tailwind, Lucide — runs on port 3002
- JWT-protected views for managing products, orders, bulk orders, reviews, and messages

This is a **monorepo with no workspace tooling**: `server/`, `web/`, and `admin/` are
independent npm packages installed and run separately.

## Quickstart

> Full step-by-step instructions are in [docs/setup.md](docs/setup.md).

1. **Prerequisites:** Node.js and Docker.
2. **Start Postgres:**
   ```bash
   docker compose up -d postgres
   ```
3. **Configure env files:**
   - `cp server/.env.example server/.env` and set `DATABASE_URL`, `PORT` (8080),
     `FRONTEND_URL`, `ADMIN_URL`, `JWT_SECRET`, and `ADMIN_EMAIL`/`ADMIN_PASSWORD`
     (the last two seed the first admin login).
   - `cp web/.env.local.example web/.env.local` and set `NEXT_PUBLIC_API_URL`.
   - `cp admin/.env.example admin/.env` and set `NEXT_PUBLIC_API_URL`.
4. **Backend:**
   ```bash
   cd server
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev          # http://localhost:8080  (health: /health)
   ```
5. **Storefront (new terminal):**
   ```bash
   cd web
   npm install
   npm run dev          # http://localhost:3000
   ```
6. **Admin dashboard (new terminal):**
   ```bash
   cd admin
   npm install
   npm run dev          # http://localhost:3002  (log in with ADMIN_EMAIL/ADMIN_PASSWORD)
   ```

> All three apps must agree on the server URL: the storefront and admin
> `NEXT_PUBLIC_API_URL` point at the server's `PORT` (default `8080`).

## Scripts

**server/**

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with reload (port 8080) |
| `npm run build` | Compile TypeScript (`tsc`) |
| `npm run start` | Run the compiled server |
| `npm run db:generate` | Generate a Drizzle migration from the schema |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Drizzle Studio |

**root**

| Command | Description |
|---------|-------------|
| `docker compose up -d postgres` | Start the local Postgres container on port 5433 |
| `docker compose down` | Stop the local Postgres container |

**web/**

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with `next lint` |

**admin/**

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3002) |
| `npm run build` | Production build |
| `npm run start` | Run the production build (port 3002) |
| `npm run lint` | Lint with `next lint` |

## Documentation

- [CLAUDE.md](CLAUDE.md) — conventions & **requirements to check before making a change**
- [docs/architecture.md](docs/architecture.md) — system architecture & request flow
- [docs/api-reference.md](docs/api-reference.md) — all `/api` endpoints
- [docs/database.md](docs/database.md) — schema & migration workflow
- [docs/setup.md](docs/setup.md) — local development setup
- [docs/deployment.md](docs/deployment.md) — production env vars & deploy checklist
