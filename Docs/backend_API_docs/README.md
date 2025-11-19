# Backend API (V2) Documentation

This document describes the current backend API routes and their real response shapes, based on the code in `backendV2`.

---

## Base URLs

- Frontend: `https://insta.the1s.de`
- Backend: `https://backend.insta.the1s.de`
- Base path: `https://backend.insta.the1s.de/api`

Service status: `https://status.the1s.de`

---

## Authentication

All **protected** endpoints require an API key as a path parameter `:key`.

Rules for `:key`:

- Exactly 8 characters  
- Digits only (`^[0-9]{8}$`)

Example:

```http
GET /api/items/12345678
```

On missing / invalid key:

- Status: `401 Unauthorized`
- Body (exact message depends on `authenticate` in `backendV2/services/authentication.js`)

Auth-related modules:

- `backendV2/services/authentication.js`
- `backendV2/services/database.js`

Route handlers:

- `backendV2/routes/api/api.route.js`
- `backendV2/routes/api/api.database.js`

---

## Endpoints (Overview)

1. **Public**
   - `GET /api/all-items` – List all items (no auth; from original docs)

2. **Items (authenticated)**
   - `GET /api/items/:key` – List all items
   - `POST /api/change-state/:key/:itemId/:state` – Toggle item safe state

3. **Loans (authenticated)**
   - `GET /api/get-loan-by-code/:key/:loan_code` – Get loan by code
   - `POST /api/set-take-date/:key/:loan_code` – Set “take” date and mark items as out
   - `POST /api/set-return-date/:key/:loan_code` – Set “return” date and mark items as returned

---

## 1) Items

### 1.1 Get all items

**GET** `/api/items/:key`

Returns all items wrapped in a `data` property.

- Handler: `getItemsFromDatabaseV2` in `api.database.js`
- SQL: `SELECT * FROM items;`

#### Example request

```http
GET https://backend.insta.the1s.de/api/items/12345678
```

#### Successful response

```json
{
  "data": [
    {
      "id": 1,
      "item_name": "DJI 1er Mikro",
      "can_borrow_role": 4,
      "inSafe": 1,
      "safe_nr": "01",
      "entry_created_at": "2025-08-19T22:02:16.000Z",
      "entry_updated_at": "2025-08-19T22:02:16.000Z",
      "last_borrowed_person": "alice",
      "currently_borrowing": null
    }
  ]
}
```

#### Error response

```json
{ "message": "Failed to fetch items" }
```

#### Status codes

- `200 OK` – success, `data` is an array (possibly empty)
- `401 Unauthorized` – invalid / missing key
- `500 Internal Server Error` – database error or `success: false` from DB layer

---

### 2.2 Toggle item safe state

**POST** `/api/change-state/:key/:itemId/:state`

> You do not need this endpoint to set the states of the items when the items are taken out or returned. When you take or return a loan, the item states are set automatically by the loan endpoints. This endpoint is only for manually toggling the `inSafe` state of an item.

Path parameters:

- `:key` – API key (8 digits)
- `:itemId` – numeric `id` of the item
- `:state` – must be `"1"` or `"0"`

Handler in `api.route.js` calls `changeInSafeStateV2(itemId)`, which executes:

```sql
UPDATE items SET inSafe = NOT inSafe WHERE id = ?
```

#### Example request

```http
POST https://backend.insta.the1s.de/api/change-state/12345678/42/1
```

(Will toggle `inSafe` for item `42`, regardless of the final `1`.)

#### Successful response (current implementation)

```json
{
  "data": null
}
```

#### Error responses

Invalid `state` (anything other than `"0"` or `"1"`):

```json
{ "message": "Invalid state value" }
```

Failed update:

```json
{ "message": "Failed to update item state" }
```

#### Status codes

- `200 OK` – item state toggled
- `400 Bad Request` – invalid `state` parameter
- `401 Unauthorized` – invalid / missing key
- `500 Internal Server Error` – database/update failure or `success: false` from DB layer

---

## 3) Loans

### 3.1 Get loan by code

**GET** `/api/get-loan-by-code/:key/:loan_code`

Path parameters:

- `:key` – API key
- `:loan_code` – 6-digit loan code (`^[0-9]{6}$` per DB constraint)

Database layer (`getLoanByCodeV2`) currently selects:

```sql
SELECT first_name, returned_date, take_date, lockers
FROM loans
WHERE loan_code = ?;
```

#### Example request

```http
GET https://backend.insta.the1s.de/api/get-loan-by-code/12345678/646473
```

#### Successful response

```json
{
  "data": {
    "first_name": "Theis",
    "returned_date": null,
    "take_date": "2025-08-25T13:23:00.000Z",
    "lockers": ["01", "03"]
  }
}
```

#### Error response

```json
{ "message": "Loan not found" }
```

#### Status codes

- `200 OK` – loan found
- `401 Unauthorized` – invalid / missing key
- `404 Not Found` – no matching loan for this `loan_code`

---

### 3.2 Set take date

**POST** `/api/set-take-date/:key/:loan_code`

Path parameters:

- `:key` – API key
- `:loan_code` – loan code

#### Example request

```http
POST https://backend.insta.the1s.de/api/set-take-date/12345678/646473
```

#### Successful response

```json
{
  "data": null
}
```

#### Error response

```json
{ "message": "Failed to set take date" }
```

#### Status codes

- `200 OK` – take date set and items marked as out
- `401 Unauthorized` – invalid / missing key
- `500 Internal Server Error` – invalid loan, missing items, or DB error / `success: false`

---

### 3.3 Set return date

**POST** `/api/set-return-date/:key/:loan_code`

Path parameters:

- `:key` – API key
- `:loan_code` – loan code

#### Example request

```http
POST https://backend.insta.the1s.de/api/set-return-date/12345678/646473
```

#### Successful response (current implementation)

```json
{
  "data": null
}
```

#### Error response

```json
{ "message": "Failed to set return date" }
```

#### Status codes

- `200 OK` – return date set and items marked as returned
- `401 Unauthorized` – invalid / missing key
- `500 Internal Server Error` – invalid loan, missing items, or DB error / `success: false`

---

## Common Response Shapes

**Success – list (authenticated items):**

```json
{ "data": [ /* array of rows */ ] }
```

**Success – single loan:**

```json
{ "data": { /* selected loan fields */ } }
```

**Success – mutations (current code):**

```json
{ "data": null }
```

**Errors:**

```json
{ "message": "Failed to fetch items" }
{ "message": "Failed to update item state" }
{ "message": "Invalid state value" }
{ "message": "Loan not found" }
{ "message": "Failed to set return date" }
{ "message": "Failed to set take date" }
```

**HTTP Status Codes:**

- `200 OK` – operation succeeded
- `400 Bad Request` – invalid `state` parameter
- `401 Unauthorized` – invalid/missing API key
- `404 Not Found` – loan not found
- `500 Internal Server Error` – database / server failure or `success: false` from DB layer