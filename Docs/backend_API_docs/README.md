# Backend API (V2) Documentation

This document describes the current backend API routes and their real response shapes.

## Base URLs

- Frontend: https://insta.the1s.de
- Backend: https://backend.insta.the1s.de
- Base path: https://backend.insta.the1s.de/api

Service status: https://status.the1s.de

---

## Authentication

All endpoints require an API key as a path parameter `:key`.

Rules:

- Exactly 8 characters
- Digits only

Example:

```
GET /api/items/12345678
```

Error if missing/invalid: `401 Unauthorized`.

Auth modules:

- backendV2/services/authentication.js
- backendV2/services/database.js

Route handlers:

- backendV2/routes/api/api.route.js
- backendV2/routes/api/api.database.js

---

## Endpoints

### 1) Get all items (authenticated)

GET `/api/items/:key`

Returns all items wrapped in a `data` object.

Example:

```
GET https://backend.insta.the1s.de/api/items/12345678
```

Successful response (example structure; actual columns depend on table):

```json
{
  "data": [
    {
      "id": 1,
      "item_name": "DJI 1er Mikro",
      "can_borrow_role": 4,
      "inSafe": 1,
      "currently_borrowing": null,
      "last_borrowed_person": "alice",
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    }
  ]
}
```

Status codes:

- 200 success
- 500 database error

### 2) Toggle item safe state (authenticated)

POST `/api/change-state/:key/:itemId/:state`

Parameters:

- `itemId`: numeric item ID
- `state`: must be `"1"` or `"0"` (validated), but the current implementation IGNORES this value and toggles `inSafe` (SQL uses `SET inSafe = NOT inSafe`).

Example:

```
POST https://backend.insta.the1s.de/api/change-state/12345678/42/1
```

Current success response:

```json
{}
```

(Empty object because the handler sends `{ data: result.data }` and the database layer returns no `data`.)

Status codes:

- 200 toggled
- 400 invalid `state` (anything other than "0"/"1")
- 500 failure

Note: To actually set a specific state, the database function would need adjustment.

### 3) Get loan by code (authenticated)

GET `/api/get-loan-by-code/:key/:loan_code`

Returns limited loan fields (current implementation selects only: `username, returned_date, take_date, lockers`).

Example:

```
GET https://backend.insta.the1s.de/api/get-loan-by-code/12345678/646473
```

Response (if found):

```json
{
  "data": {
    "username": "theis",
    "returned_date": null,
    "take_date": "2025-08-25T13:23:00.000Z",
    "lockers": "A2"
  }
}
```

Status codes:

- 200 found
- 404 not found

### 4) Set return date (authenticated)

POST `/api/set-return-date/:key/:loan_code`

Sets `returned_date = NOW()` for the loan. Also updates all linked items:

- `inSafe = 1`
- `currently_borrowing = NULL`
- `last_borrowed_person = <loan owner username>`

Example:

```
POST https://backend.insta.the1s.de/api/set-return-date/12345678/646473
```

Response on success:

```json
{}
```

Status codes:

- 200 success
- 500 failure

### 5) Set take date (authenticated)

POST `/api/set-take-date/:key/:loan_code`

Sets `take_date = NOW()` for the loan. Also updates linked items:

- `inSafe = 0`
- `currently_borrowing = <loan owner username>`

Example:

```
POST https://backend.insta.the1s.de/api/set-take-date/12345678/646473
```

Response on success:

```json
{}
```

Status codes:

- 200 success
- 500 failure

### 6) Get all items (public, no key)

GET `/api/all-items`

Same data as endpoint (1) but NOT wrapped in `data`.

Example:

```
GET https://backend.insta.the1s.de/api/all-items
```

Response:

```json
[
  {
    "id": 1,
    "item_name": "DJI 1er Mikro",
    "can_borrow_role": 4,
    "inSafe": 1,
    "currently_borrowing": null,
    "last_borrowed_person": "alice",
    "entry_created_at": "2025-08-19T22:02:16.000Z"
  }
]
```

Status codes:

- 200 success
- 500 failure

---

## Response Summary

Common success forms:

- List (wrapped): `{ "data": [ ... ] }`
- Single loan: `{ "data": { ... } }`
- Mutation (current implementation): `{}` (no payload)

Errors:

```json
{ "message": "Failed to fetch items" }
{ "message": "Failed to update item state" }
{ "message": "Invalid state value" }
{ "message": "Loan not found" }
{ "message": "Failed to set return date" }
{ "message": "Failed to set take date" }
```

Status Codes:

- 200 OK
- 400 Bad Request (invalid state param)
- 401 Unauthorized (invalid/missing key)
- 404 Not Found (loan)
- 500 Internal Server Error (database/update failure)

---

## Notes / Implementation Gaps

- `change-state` ignores requested `state` and toggles instead.
- Mutation endpoints return empty JSON; include a result object if feedback is needed.
- `get-loan-by-code` returns fewer fields than earlier documentation suggested.

---

For collaboration, reach out via the admin channel.
