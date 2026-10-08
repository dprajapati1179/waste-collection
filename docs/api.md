# API

Base URL: `http://localhost:4000`. All bodies are JSON and use snake_case.

## Error format

Every error response has the same shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [{ "field": "weight", "message": "weight must be greater than 0" }]
  }
}
```

| Code                   | Status    | When                                                            |
| ---------------------- | --------- | --------------------------------------------------------------- |
| `VALIDATION_ERROR`     | 400 / 413 | Invalid fields, unknown fields, malformed JSON, body over 10 kB |
| `DUPLICATE_COLLECTION` | 409       | The `qr_id` has already been collected                          |
| `NOT_FOUND`            | 404       | Unknown route                                                   |
| `INTERNAL_ERROR`       | 500       | Unexpected failure. Details are logged, not returned.           |

## `POST /collections`

Records a collected bag.

```json
{
  "qr_id": "BAG-1001",
  "weight": 12.5,
  "timestamp": "2026-10-08T10:30:00.000Z"
}
```

| Field       | Rules                                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| `qr_id`     | Required string, trimmed, 1 to 128 characters                                 |
| `weight`    | Required number in kg, greater than 0, at most 1000, at most 2 decimal places |
| `timestamp` | Required ISO 8601 date-time, not more than 5 minutes in the future            |

Any other field is rejected, including `points`.

**201 Created**

```json
{
  "data": {
    "id": "f467142f-cb1e-47c7-8f1d-53baa29ae365",
    "qr_id": "BAG-1001",
    "weight": 12.5,
    "points": 188,
    "timestamp": "2026-10-08T10:30:00.000Z",
    "created_at": "2026-10-08T10:30:01.442Z"
  }
}
```

Points are calculated by the server as `round(weight × 15)`.

**409 Conflict**

```json
{ "error": { "code": "DUPLICATE_COLLECTION", "message": "This bag has already been collected" } }
```

```bash
curl -X POST http://localhost:4000/collections \
  -H 'Content-Type: application/json' \
  -d '{"qr_id":"BAG-1001","weight":12.5,"timestamp":"2026-10-08T10:30:00.000Z"}'
```

## `GET /collections`

Returns all successful collections, newest first by `created_at`. There is no pagination.

**200 OK**

```json
{
  "data": [
    {
      "id": "f467142f-cb1e-47c7-8f1d-53baa29ae365",
      "qr_id": "BAG-1001",
      "weight": 12.5,
      "points": 188,
      "timestamp": "2026-10-08T10:30:00.000Z",
      "created_at": "2026-10-08T10:30:01.442Z"
    }
  ]
}
```

## `GET /health`

**200 OK**

```json
{ "status": "ok" }
```
