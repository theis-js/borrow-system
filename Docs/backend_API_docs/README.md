# Borrow System API Documentation

**Frontend:** https://insta.the1s.de  
**Backend base URL:** `https://backend.insta.the1s.de/api`

---

## Authentication

All API endpoints require **either**:

### 1. Bearer Token (JWT)

Send an `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

- Used for user-based access.
- Token must be valid and not expired.

### 2. API Key (for devices / machine-to-machine)

Include an API key in the route as `:key` parameter:

```text
/api/.../:key/...
```

Example:

```http
GET /api/items/12345678
```

Where `12345678` is your API key.  
The API key is validated server-side.

---

## Common Response Codes

- `200 OK` – Request was successful.
- `401 Unauthorized` – Missing or malformed credentials.
- `403 Forbidden` – Credentials invalid or not allowed to access this resource.
- `404 Not Found` – Resource (e.g., loan) not found.
- `500 Internal Server Error` – Unexpected server error.

---

## Endpoints

### 1. Get All Items

**GET** `/api/items/:key`

Returns a list of all items.

#### Path Parameters

- `:key` – API key (8-digit number)

#### Authentication

- Either:
  - Valid `Authorization: Bearer <token>`
  - Or valid `:key` path parameter

#### Request Example

```http
GET /api/items/12345678 HTTP/1.1
Host: backend.insta.the1s.de
Authorization: Bearer <JWT_TOKEN>
```

#### Successful Response (200)

```json
{
  "data": [
    {
      "id": 1,
      "item_name": "DJI 1er Mikro",
      "can_borrow_role": 4,
      "inSafe": 1,
      "safe_nr": 3,
      "door_key": "123",
      "entry_created_at": "2025-08-19T22:02:16.000Z",
      "entry_updated_at": "2025-08-19T22:02:16.000Z",
      "last_borrowed_person": "alice",
      "currently_borrowing": null
    }
  ]
}
```

#### Error Response (500)

```json
{
  "message": "Failed to fetch items"
}
```

---

### 2. Toggle Item Safe State

Toggles `in_safe` between `0` and `1` for a given item.

**Keep in mind that when you return a loan by code, the item states are automatically updated.**

**POST** `/api/change-state/:key/:itemId`

#### Path Parameters

- `:key` – API key (8-digit number)
- `:itemId` – Item ID (integer)

#### Authentication

- Either Bearer token or `:key` API key.

#### Request Example

```http
POST /api/change-state/12345678/42 HTTP/1.1
Host: backend.insta.the1s.de
```

#### Successful Response (200)

```json
{
  "data": {}
}
```

_(Implementation currently only returns `{ success: true }`, so `data` may be empty.)_

#### Error Response (500)

```json
{
  "message": "Failed to update item state"
}
```

---

### 3. Get Loan by Code

Fetch loan information by `loan_code`.

**GET** `/api/get-loan-by-code/:key/:loan_code`

#### Path Parameters

- `:key` – API key (8-digit number)
- `:loan_code` – Loan code (string)

#### Authentication

- Either Bearer token or `:key` API key.

#### Request Example

```http
GET /api/get-loan-by-code/12345678/12345 HTTP/1.1
Host: backend.insta.the1s.de
```

#### Successful Response (200)

```json
{
  "data": {
    "username": "john",
    "returned_date": null,
    "take_date": "2025-01-01T10:00:00.000Z",
    "lockers": "[1, 2, 3]"
  }
}
```

#### Error Response (404)

```json
{
  "message": "Loan not found"
}
```

---

### 4. Set Loan Return Date

Sets `returned_date = NOW()` on a loan and updates related items:

- `in_safe = 1`
- `currently_borrowing = NULL`
- `last_borrowed_person = username`

**POST** `/api/set-return-date/:key/:loan_code`

#### Path Parameters

- `:key` – API key (8-digit number)
- `:loan_code` – Loan code (string)

#### Authentication

- Either Bearer token or `:key` API key.

#### Request Example

```http
POST /api/set-return-date/12345678/12345 HTTP/1.1
Host: backend.insta.the1s.de
```

#### Successful Response (200)

```json
{
  "data": {}
}
```

#### Error Response (500)

```json
{
  "message": "Failed to set return date"
}
```

---

### 5. Set Loan Take Date

Sets `take_date = NOW()` on a loan and updates related items:

- `in_safe = 0`
- `currently_borrowing = username`

**POST** `/api/set-take-date/:key/:loan_code`

#### Path Parameters

- `:key` – API key (8-digit number)
- `:loan_code` – Loan code (string)

#### Authentication

- Either Bearer token or `:key` API key.

#### Request Example

```http
POST /api/set-take-date/12345678/LOAN-12345 HTTP/1.1
Host: backend.insta.the1s.de
```

#### Successful Response (200)

```json
{
  "data": {}
}
```

#### Error Response (500)

```json
{
  "message": "Failed to set take date"
}
```

---

### 6. Open Door by Door Key

Looks up an item by its `door_key`, toggles `in_safe`, and returns safe information.

**GET** `/api/open-door/:key/:doorKey`

#### Path Parameters

- `:key` – API key (8-digit number)
- `:doorKey` – Door key/token (string) used by hardware to identify the locker.

#### Authentication

- Either Bearer token or `:key` API key.

#### Request Example

```http
GET /api/open-door/12345678/123 HTTP/1.1
Host: backend.insta.the1s.de
```

#### Successful Response (200)

```json
{
  "data": {
    "safe_nr": 5,
    "id": 42
  }
}
```

#### Error Response (500)

```json
{
  "message": "Failed to open door"
}
```

---

## Authentication Error Messages

### Missing credentials

Status: `401`

```json
{
  "message": "Unauthorized"
}
```

### Invalid JWT

Status: `403`

```json
{
  "message": "Present token invalid"
}
```

### Invalid API Key

Status: `403`

```json
{
  "message": "API Key invalid"
}
```

---

## Notes

- All responses are JSON.
- Time fields like `take_date` and `returned_date` are in the format returned by MySQL (usually ISO-like strings).
- `loaned_items_id` in the database is stored as a JSON array string (e.g. `"[1,2,3]"`) and is parsed internally; clients do not interact with this field directly via current endpoints.
