# Deployment & production environment

Chumzy Raw Foods is three independently deployable apps plus a database:

| App | What it is | Typical host | Build | Run |
|-----|------------|--------------|-------|-----|
| `server/` | Hono REST API | Any Node host / container (Render, Railway, Fly, VM) | `npm run build` | `npm run start` |
| `web/` | Next.js storefront | Vercel / Node host | `npm run build` | `npm run start` |
| `admin/` | Next.js admin dashboard | Vercel / Node host | `npm run build` | `npm run start` |
| Postgres | Managed PostgreSQL | Neon, Supabase, RDS, etc. | — | — |

The server already binds `0.0.0.0` and reads `PORT`, so it works on container/PaaS
hosts without changes.

## Required environment variables

> **`NEXT_PUBLIC_*` is baked in at build time.** For `web` and `admin` these values
> are compiled into the bundle during `npm run build` — set them in the build
> environment, not just at runtime. Rebuild after changing them.

### Server / API — `server/`

| Var | Required | Notes |
|-----|----------|-------|
| `DATABASE_URL` | **Yes** | Postgres connection string. Managed providers usually need `?sslmode=require`. |
| `JWT_SECRET` | **Yes** | Long random string for admin auth. The dev default (`dev-secret-change-me`) **must** be replaced. |
| `FRONTEND_URL` | **Yes** | Public storefront origin, e.g. `https://chumzy.com`. Used for CORS — requests from other origins are rejected. |
| `ADMIN_URL` | **Yes** | Public admin origin, e.g. `https://admin.chumzy.com`. Also used for CORS. |
| `PORT` | Host-dependent | Most PaaS hosts inject this. Code falls back to `3001` if unset. |
| `ADMIN_EMAIL` | Seed only | First admin login email — read once by `npm run db:seed`. |
| `ADMIN_PASSWORD` | Seed only | First admin password (stored bcrypt-hashed). |

### Storefront — `web/`

| Var | Required | Notes |
|-----|----------|-------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Public API base, e.g. `https://api.chumzy.com`. Without it the build falls back to `http://localhost:8080` and **all API calls fail in production**. |

### Admin dashboard — `admin/`

| Var | Required | Notes |
|-----|----------|-------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Same production API base as the storefront. |

## CORS

The API only accepts browser requests whose `Origin` matches `FRONTEND_URL` or
`ADMIN_URL` (any `localhost` origin is also allowed, for local dev). If the storefront
or admin can reach the API from a terminal but the browser shows CORS errors, these two
vars are wrong or unset.

## First deploy — order of operations

1. **Provision Postgres** and set `DATABASE_URL` in the server environment.
2. **Run migrations** against the production DB (once, and after every schema change):
   ```bash
   cd server && npm install && npm run db:migrate
   ```
3. **Seed the first admin** (once) with `ADMIN_EMAIL` + `ADMIN_PASSWORD` set:
   ```bash
   npm run db:seed
   ```
   Seeding is idempotent (`onConflictDoNothing`) — safe to re-run; it will not create a
   duplicate admin or duplicate products.
4. **Deploy the server** with all server env vars set; confirm
   `GET /health` → `{ "status": "ok", "service": "chumzy-server" }`.
5. **Build & deploy `web` and `admin`** with `NEXT_PUBLIC_API_URL` pointing at the
   deployed server. Set `FRONTEND_URL`/`ADMIN_URL` on the server to match their final
   URLs and redeploy the server if they changed.

## Pre-deploy checklist

- [ ] `JWT_SECRET` is a strong random value (not the dev default).
- [ ] `DATABASE_URL` points at the managed DB (with SSL if required).
- [ ] `FRONTEND_URL` and `ADMIN_URL` are the real public origins.
- [ ] `NEXT_PUBLIC_API_URL` is set in the build env for both `web` and `admin`.
- [ ] Migrations applied; admin seeded once.
- [ ] All three `npm run build` succeed; `web`/`admin` `npm run lint` clean.
