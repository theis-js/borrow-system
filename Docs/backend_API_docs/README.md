# Borrow System Backend API

Base URL: `http://localhost:8002`

- App server: [backend/server.js](backend/server.js)
- Auth/JWT: [`authenticate`](backend/services/tokenService.js), [`generateToken`](backend/services/tokenService.js)
- App API (JWT): [backend/routes/api.js](backend/routes/api.js)
- Admin API (key): [backend/routes/apiV2.js](backend/routes/apiV2.js)
- DB layer: [backend/services/database.js](backend/services/database.js)
- Schema: [backend/scheme.sql](backend/scheme.sql)

## Authentication

Most endpoints under `/api` require a Bearer JWT.

1. Login to get a token

- POST /api/login
- Body: `{ "username": string, "password": string }`
- Response 200: `{ "message": "Login successful", "token": string }`
- Response 401: `{ "message": "Invalid credentials" }`

Example:

```sh
curl -s -X POST http://localhost:8002/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password1"}'
```

2. Use the token for all protected endpoints

- Header: `Authorization: Bearer <token>`

The middleware [`authenticate`](backend/services/tokenService.js) verifies tokens and attaches `req.user = { username, role }`.

Environment:

- SECRET_KEY: HMAC secret for JWT
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME: MySQL connection
- ADMIN_ID: Admin API key for /apiV2

## Data model (items)

Items (as returned by endpoints) have:

- `id`: number
- `item_name`: string
- `can_borrow_role`: number (minimum role required)
- `inSafe`: 0/1 (not in locker / in locker)

See the full schema in [backend/scheme.sql](backend/scheme.sql).

---

## App API (JWT) — /api

All routes below require `Authorization: Bearer <token>` unless noted.

### GET /api/items

Returns items filtered by the user role:

- role == 0: all items
- role > 0: items with `can_borrow_role >= role`

Implements: [`getItemsFromDatabase`](backend/services/database.js)

Response 200:

```json
[
  { "id": 1, "item_name": "Laptop", "can_borrow_role": 1, "inSafe": 1 },
  ...
]
```

Example:

```sh
curl -s http://localhost:8002/api/items \
  -H "Authorization: Bearer $TOKEN"
```

### GET /api/loans

Returns all loans.

Implements: [`getLoansFromDatabase`](backend/services/database.js)

Response 200:

```json
[
  {
    "id": 1,
    "username": "alice",
    "loan_code": 1001,
    "start_date": "2025-08-01T09:00:00.000Z",
    "end_date": "2025-08-10T09:00:00.000Z",
    "returned_date": null,
    "created_at": "2025-08-01T09:00:00.000Z",
    "loaned_items_id": [1, 2],
    "loaned_items_name": ["Laptop", "Projector"]
  }
]
```

### GET /api/userLoans

Returns loans for the authenticated user.

Implements: [`getUserLoansFromDatabase`](backend/services/database.js)

Response 200:

- On success: `Loan[]`
- If none found: `"No loans found for this user"` (string)

Tip: Treat a non-array response as “no loans”.

### DELETE /api/deleteLoan/:id

Deletes a loan by numeric ID.

Implements: [`deleteLoanFromDatabase`](backend/services/database.js)

- 200: `{ "message": "Loan deleted successfully" }`
- 500: `{ "message": "Failed to delete loan" }`

Example:

```sh
curl -s -X DELETE http://localhost:8002/api/deleteLoan/42 \
  -H "Authorization: Bearer $TOKEN"
```

### POST /api/borrowableItems

Returns items available in the given time range (excludes items with overlapping loans). Also enforces role filtering.

Implements: [`getBorrowableItemsFromDatabase`](backend/services/database.js)

Request body:

```json
{ "startDate": "2025-08-01T09:00:00Z", "endDate": "2025-08-02T09:00:00Z" }
```

- 200: `Item[]`
- 400: `{ "message": "startDate and endDate are required" }`
- 500: `{ "message": "Failed to fetch borrowable items" }`

Example:

```sh
curl -s -X POST http://localhost:8002/api/borrowableItems \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2025-08-01T09:00:00Z","endDate":"2025-08-02T09:00:00Z"}'
```

### POST /api/createLoan

Creates a loan for the authenticated user.

Implements: [`createLoanInDatabase`](backend/services/database.js)

Request body:

```json
{
  "items": [1, 2, 3], // array of item IDs (required)
  "startDate": "2025-08-01T09:00:00Z", // required
  "endDate": "2025-08-02T09:00:00Z" // required
}
```

Notes:

- IDs are coerced to numbers; invalid entries are dropped.
- Date range must be valid and `startDate < endDate`.
- Overlaps with existing loans cause 409 Conflict.
- On success, returns the generated `loanCode`.

Responses:

- 201:

```json
{
  "message": "Loan created successfully",
  "loanId": 123,
  "loanCode": 1007
}
```

- 400: `{ "message": "Items array is required" | "No valid item IDs provided" | "Invalid date range" | ... }`
- 409: `{ "message": "Items not available in the selected period" }`
- 500: `{ "message": "Failed to create loan" }`

Example:

```sh
curl -s -X POST http://localhost:8002/api/createLoan \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[1,2],"startDate":"2025-08-01T09:00:00Z","endDate":"2025-08-02T09:00:00Z"}'
```

---

## Admin API — /apiV2

These endpoints are protected by a static admin key in the path. Set `ADMIN_ID` in environment. No JWT required.

### GET /apiV2/items/:key

Returns all items (no role filtering).

Implements: [`getItemsFromDatabaseV2`](backend/services/database.js)

- 200: `Item[]`
- 403: `{ "message": "Access denied" }`

Example:

```sh
curl -s http://localhost:8002/apiV2/items/$ADMIN_ID
```

### POST /apiV2/controlInSafe/:key/:itemId/:state

Updates `inSafe` state (0 or 1) for an item by ID.

Implements: [`changeInSafeStateV2`](backend/services/database.js)

- `state`: `"0"` or `"1"`
- 200: `{ "message": "Item state updated successfully" }`
- 400: `{ "message": "Invalid state value" }`
- 403: `{ "message": "Access denied" }`
- 500: `{ "message": "Failed to update item state" }`

Example:

```sh
curl -s -X POST http://localhost:8002/apiV2/controlInSafe/$ADMIN_ID/5/0
```

---

## Error handling summary

- 400 Bad Request: invalid payloads or missing fields
- 401 Unauthorized: missing/invalid JWT (for `/api` routes)
- 403 Forbidden: wrong admin key (for `/apiV2` routes)
- 409 Conflict: loan overlaps with selected period
- 500 Internal Server Error: unexpected server/database errors

---

## Running locally

With Docker Compose: [docker-compose.yml](docker-compose.yml)

- Backend: http://localhost:8002 (mounted from [backend](backend))
- MySQL: root password from `.env` as `DB_PASSWORD`, port 3309 on host
- Seed schema/data: import [backend/scheme.sql](backend/scheme.sql) into the DB

Environment required by backend:

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `SECRET_KEY`
- `ADMIN_ID`

---

References:

- App routes: [backend/routes/api.js](backend/routes/api.js)
  - [`loginFunc`](backend/services/database.js), [`getItemsFromDatabase`](backend/services/database.js), [`getLoansFromDatabase`](backend/services/database.js), [`getUserLoansFromDatabase`](backend/services/database.js), [`deleteLoanFromDatabase`](backend/services/database.js), [`getBorrowableItemsFromDatabase`](backend/services/database.js), [`createLoanInDatabase`](backend/services/database.js)
- Admin routes: [backend/routes/apiV2.js](backend/routes/apiV2.js)
- Auth: [`authenticate`](backend/services/tokenService.js),
