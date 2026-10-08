# Waste Collection

A field collector scans a waste bag's QR code, logs its weight and submits the collection. An admin reviews completed collections in a web dashboard.

## Repository structure

```
apps/
  api/        Node.js + Express + TypeScript REST API
  mobile/     Expo + React Native collector app
  web/        Next.js admin dashboard
packages/
  types/      Shared TypeScript domain and API types
docs/         Architecture, API and assumptions
```

## Prerequisites

- Node.js 22+
- pnpm 12+
- Expo Go on a phone (for the mobile app)

## Getting started

```bash
pnpm install
```

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `pnpm dev:api`    | Start the API on port 4000             |
| `pnpm dev:web`    | Start the admin dashboard on port 3000 |
| `pnpm dev:mobile` | Start the Expo dev server              |
| `pnpm lint`       | Lint all packages                      |
| `pnpm typecheck`  | Type-check all packages                |
| `pnpm format`     | Format the repository with Prettier    |
