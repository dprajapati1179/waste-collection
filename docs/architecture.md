# Architecture

## Overview

```
Collector mobile app ──POST /collections──▶ REST API ──▶ SQLite
                                               ▲
Admin web dashboard ───GET /collections────────┘
```

| Part             | Responsibility                                                            |
| ---------------- | ------------------------------------------------------------------------- |
| `apps/mobile`    | Scan a bag QR code, capture weight, submit, recover from failures         |
| `apps/api`       | Validate input, enforce one collection per bag, calculate points, persist |
| `apps/web`       | Show successful collections to internal staff                             |
| `packages/types` | Request, response and error types shared by all three apps                |

The API is the only component that writes data or calculates points. Clients are treated as untrusted input.

## Mobile

The app has a single screen driven by one status value:

```
scanning → scanned → submitting → success
                ▲          │
                └─ error ◀─┘
```

- `collectionSlice` holds the permission state, status, scanned `qrId`, raw weight text, the capture timestamp, the last error and the last result. A single status field avoids invalid combinations such as "submitting and failed".
- `submitCollection` (an RTK async thunk) reads the state, waits for the simulated 3 second delay, calls the API service and returns a typed error on failure. Its `condition` blocks a second submit while one is in progress.
- On failure the reducer only changes `status` and `error`. The QR ID, weight and timestamp stay in the store, so **Retry** sends the same data. The timestamp is fixed on the first attempt so a retry still records when the bag was collected.
- `services/collectionsApi.ts` owns `fetch`, the request timeout and the mapping of network errors and HTTP status codes to `network`, `validation`, `duplicate` or `server` errors. Components never call `fetch`.
- Camera logic lives in `useCameraPermission` and `QrScanner`. The scanner locks on the first result because the camera reports the same code several times before React re-renders.
- A settings screen exposes the API URL and toggles to simulate a network failure or a 500, so both failure paths can be shown without rebuilding.

## API

```
route → controller → service → repository → Prisma → SQLite
```

- **Controller** parses the body with a strict Zod schema and turns failures into a `400` with field-level details.
- **Service** calculates points (`round(weight × 15)`) and maps database records to the snake_case API shape.
- **Repository** is the only layer that talks to Prisma. It translates Prisma's unique constraint error (`P2002`) into a domain error, which the service returns as `409`.
- A central error handler returns `{ error: { code, message, details? } }` for every failure and hides internal errors behind a generic `500`.

Duplicate prevention relies on the `UNIQUE` index on `qr_id`, not on a read-before-write check. Two simultaneous submissions for the same bag therefore produce exactly one `201` and one `409`, which is covered by a test.

## Web

The dashboard is one Next.js page. The table is rendered on the server inside a `Suspense` boundary, so the page shell loads immediately and the data is fetched on every request. Fetching on the server means the API does not need CORS. Loading, empty and error states are handled explicitly, and a Refresh button re-requests the data.

## Technology choices

| Choice                  | Reason                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm workspace monorepo | Three apps share one set of API types and tooling. Workspaces are enough at this size; Turborepo or Nx would add configuration without benefit.                                 |
| Redux Toolkit           | The submission lifecycle has several states that must survive failures. A slice plus an async thunk keeps that logic out of components and makes it testable without rendering. |
| Express                 | Small and well understood. The routing and middleware needs here are minimal.                                                                                                   |
| SQLite                  | No server to install, a single file, and it supports the unique constraint the duplicate rule depends on.                                                                       |
| Prisma                  | Typed queries, versioned migrations and a clear error code for unique violations.                                                                                               |
| Zod                     | Declarative validation with readable error messages, and strict mode to reject unexpected fields such as `points`.                                                              |
