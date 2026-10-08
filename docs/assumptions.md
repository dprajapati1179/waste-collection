# Assumptions

## Domain

- `qr_id` represents a unique waste bag. It is trimmed and compared case-sensitively.
- A bag can only be successfully collected once. Later submissions return `409 Conflict`, even with a different weight.
- Weight is in kilograms and must be positive. Values above 1000 kg or with more than 2 decimal places are treated as input errors.
- Points are calculated only by the backend as `round(weight × 15)`, so 12.5 kg earns 188 points. Very small weights can round to 0 points.
- Only successful collections are stored. Rejected submissions are not kept, so the admin feed shows successful collections without needing a status column.

## Time

- The mobile timestamp is accepted as the collection time for this exercise. The server also records its own receipt time as `created_at`, which a production system should rely on for auditing.
- The mobile app sets the timestamp on the first submit attempt and reuses it on retries.
- Timestamps more than 5 minutes ahead of the server clock are rejected, which allows for small clock differences between devices.
- The admin feed is ordered by `created_at` because the client cannot alter it.

## Scope

- Authentication and authorization are outside the scope of this exercise.
- SQLite is sufficient for a single API instance. A production deployment would use PostgreSQL; the Prisma schema would need only a provider change.
- The 3 second delay is simulated on the client before the request is sent, so the loading state is visible on a fast local network. It can be turned off in the app settings.
- Submissions are not queued while offline. The app keeps the scanned data in memory and the collector retries manually.
- App settings are kept in memory and reset when the app restarts.
