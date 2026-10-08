# Waste Collection

A field collector scans the QR code on a waste bag, enters its weight and submits the collection. The backend validates the submission, rejects bags that were already collected and allocates points. An admin dashboard lists completed collections.

The focus is on reliable data flow and error handling rather than UI polish.

## Architecture

```
Collector mobile app ──POST /collections──▶ REST API ──▶ SQLite
                                               ▲
Admin web dashboard ───GET /collections────────┘
```

- **Mobile** (Expo, React Native, Redux Toolkit): scanning, weight entry, submission with loading, failure and retry states.
- **API** (Express, Zod, Prisma): validation, duplicate prevention, points calculation and persistence.
- **Web** (Next.js): read-only table of successful collections.

See [docs/architecture.md](docs/architecture.md) for the data flow and design decisions.

## Repository structure

```
apps/
  api/        Express REST API, Prisma schema and migrations, Jest tests
  mobile/     Expo collector app
  web/        Next.js admin dashboard
packages/
  types/      Shared request, response and error types
docs/         Architecture, API reference, assumptions and diagrams
```

## Technology stack

| Area    | Tools                                                             |
| ------- | ----------------------------------------------------------------- |
| Mobile  | Expo SDK 57, React Native, TypeScript, Redux Toolkit, expo-camera |
| Web     | Next.js 16, React, TypeScript                                     |
| API     | Node.js, Express 5, TypeScript, Zod, Prisma 7, SQLite             |
| Testing | Jest, Supertest                                                   |
| Tooling | pnpm workspaces, ESLint, Prettier, GitHub Actions                 |

## Prerequisites

- Node.js 22 or newer
- pnpm 12
- Expo Go on an Android or iOS phone, on the same Wi-Fi network as the computer running the API

## Installation

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm --filter @waste-collection/api db:deploy
```

`pnpm install` also generates the Prisma client. `db:deploy` creates `apps/api/dev.db` and applies the migrations.

## Running the API

```bash
pnpm dev:api
```

The API listens on `http://localhost:4000`. Check it with `curl http://localhost:4000/health`.

## Running the web dashboard

```bash
pnpm dev:web
```

Open `http://localhost:3000`. The API must be running for the table to load.

## Running the mobile app

```bash
pnpm dev:mobile
```

Scan the QR code shown in the terminal with Expo Go. The app derives the API address from the Expo dev server, so it reaches the API on the same machine without extra setup. To use a different address, set `EXPO_PUBLIC_API_URL` or change it under **Settings** in the app.

The Settings screen can also turn the 3 second delay off and simulate a network failure or a server error.

## Environment variables

| App    | Variable              | Default                           | Purpose                             |
| ------ | --------------------- | --------------------------------- | ----------------------------------- |
| api    | `PORT`                | `4000`                            | HTTP port                           |
| api    | `DATABASE_URL`        | `file:./dev.db`                   | SQLite file, relative to `apps/api` |
| web    | `API_URL`             | `http://localhost:4000`           | API base URL used by the dashboard  |
| mobile | `EXPO_PUBLIC_API_URL` | Expo dev server host on port 4000 | API base URL used by the app        |

## API endpoints

| Method | Path           | Description                                         |
| ------ | -------------- | --------------------------------------------------- |
| `POST` | `/collections` | Record a collection. Returns `201`, `400` or `409`. |
| `GET`  | `/collections` | List successful collections, newest first           |
| `GET`  | `/health`      | Health check                                        |

Request and response examples are in [docs/api.md](docs/api.md).

## Testing

```bash
pnpm test
```

- **API:** Supertest covers validation, points, persistence, duplicates, simultaneous duplicate submissions, the feed and error responses. Tests run against a separate `test.db` that is recreated on each run, so the development database is never touched.
- **Mobile:** Jest covers weight validation and the submission flow against a mocked `fetch`: success, network failure and retry, each HTTP error, repeated submits and the simulated delay.

The API test script sets `NODE_OPTIONS` using POSIX shell syntax, so run it from macOS, Linux or WSL.

Other checks: `pnpm lint`, `pnpm typecheck` and `pnpm format:check`. CI runs all of them plus the web build.

## Assumptions

- `qr_id` identifies a unique bag, and a bag can only be collected once.
- Weight must be positive. Points are always calculated by the backend.
- Authentication is outside the scope of this exercise.
- SQLite is sufficient for this exercise.
- The mobile timestamp is accepted as the collection time. The server also stores its own receipt time as `created_at`.

The full list is in [docs/assumptions.md](docs/assumptions.md).

## Trade-offs

- **Database constraint over application checks.** Duplicate prevention relies on a unique index rather than a lookup before insert, which keeps it correct under concurrent requests.
- **Strict validation.** Unknown fields are rejected instead of ignored, so a client sending its own `points` gets a clear `400`.
- **In-memory retry over an offline queue.** Failed submissions keep their data on screen for a manual retry. Persisting a queue would survive app restarts but adds complexity beyond this exercise.
- **Client-side simulated delay.** The 3 second delay runs in the app before the request, so it shows the loading state without slowing the API for other clients.
- **Server-rendered dashboard.** Fetching on the server avoids CORS configuration and ships no data-fetching code to the browser.

## Known limitations

- No authentication, so anyone who can reach the API can submit or read collections.
- No pagination on the collections feed.
- Submissions are not saved if the app is closed before a successful retry.
- Dashboard timestamps are formatted in the server's time zone.
- SQLite suits a single API instance only.
