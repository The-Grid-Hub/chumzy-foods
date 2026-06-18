# Local Development Setup

## Prerequisites

- **Node.js** (with npm)
- **Docker** for the local PostgreSQL container

There is no root install — `server/` and `web/` are set up independently.

## 1. Start the database

Start the Docker-backed Postgres database from the repo root:

```bash
docker compose up -d postgres
```

The container creates the `chumzy_rawfoods` database automatically and exposes it on
`localhost:5433` so it does not conflict with a native Postgres install on `5432`.

## 2. Configure environment variables

### server (`server/.env`)

Copy the example and fill it in:

```bash
cp server/.env.example server/.env
```

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Postgres connection string | `postgresql://postgres:password@localhost:5433/chumzy_rawfoods` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |

### web (`web/.env.local`)

```bash
cp web/.env.local.example web/.env.local
```

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL the frontend calls | `http://localhost:3001` |

## 3. Start the backend

```bash
cd server
npm install
npm run db:migrate     # apply Drizzle migrations
npm run db:seed        # populate sample data
npm run dev            # http://localhost:3001
```

Verify it's up:

```bash
curl http://localhost:3001/health
# {"status":"ok","service":"chumzy-server"}
```

## 4. Start the frontend

In a second terminal:

```bash
cd web
npm install
npm run dev            # http://localhost:3000
```

Open **http://localhost:3000**. The app calls the API at **http://localhost:3001**.

## Useful commands

| Where | Command | What it does |
|-------|---------|--------------|
| server | `npm run db:studio` | Browse data in Drizzle Studio |
| server | `npm run db:generate` | Create a migration after editing `schema.ts` |
| server | `npm run build` | Typecheck/compile the server (`tsc`) |
| web | `npm run lint` | Lint the frontend |
| web | `npm run build` | Production build / typecheck |

## Troubleshooting

- **CORS errors in the browser:** ensure `FRONTEND_URL` in `server/.env` matches the
  frontend origin (`http://localhost:3000`).
- **Frontend can't reach the API:** check `NEXT_PUBLIC_API_URL` in `web/.env.local` and
  that the server is running on the expected port.
- **DB connection failures:** confirm `DATABASE_URL` is correct and Postgres is running,
  then re-run `npm run db:migrate`.
- **Port 5433 is already in use:** change the left side of the Compose port mapping, for
  example `5434:5432`, then update `DATABASE_URL` to match.
- **No data showing:** run `npm run db:seed`.

See [database.md](database.md) for the schema and migration workflow, and
[api-reference.md](api-reference.md) for endpoint details.
