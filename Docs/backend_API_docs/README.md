# Borrow System API Documentation

## Overview

The Borrow System API provides endpoints for managing items, loans, and door access for a borrowing/locker system. All endpoints require authentication via an 8-digit API key passed as a URL parameter.

## Authentication

All requests must include a valid API key in the URL path as the `:key` parameter. API keys are 8-digit numeric strings.

## Endpoints

The Base URL for all endpoints is: `https://insta.the1s.de/backend/api`

### Get All Items

`GET /items/:key`

Returns all items in the system.

**Response 200:**

```json
{
  "data": [
    {
      "id": 1,
      "item_name": "Laptop",
      "can_borrow_role": 1,
      "in_safe": true,
      "safe_nr": 3,
      "door_key": 101,
      "last_borrowed_person": "jdoe",
      "currently_borrowing": null
    }
  ]
}
```

**Response 500:**

```json
{ "message": "Failed to fetch items" }
```

---

### Change Item Safe State

`POST /change-state/:key/:itemId`

Toggles the `in_safe` boolean state of an item.

**URL Parameters:**

- **key** - API key
- **itemId** - The item's ID

**Response 200:** Returns on successful toggle.

**Response 500:**

```json
{ "message": "Failed to update item state" }
```

---

### Get Loan by Code

`GET /get-loan-by-code/:key/:loan_code`

Retrieves loan details by its 6-digit loan code.

**URL Parameters:**

- **key** - API key
- **loan_code** - A 6-digit numeric loan code

**Response 200:**

```json
{
  "data": {
    "username": "jdoe",
    "returned_date": null,
    "take_date": "2024-01-15T10:30:00.000Z",
    "lockers": [1, 3]
  }
}
```

**Response 404:**

```json
{ "message": "Loan not found" }
```

---

### Set Take Date

`POST /set-take-date/:key/:loan_code`

Records when items are physically taken by setting `take_date` to the current timestamp. Updates associated items to `in_safe = false` and sets `currently_borrowing` to the loan's username.

**URL Parameters:**

- **key** - API key
- **loan_code** - A 6-digit numeric loan code

**Response 200:** Empty JSON object on success.

**Response 500:**

```json
{ "message": "Loan not found or already taken" }
```

> **Note:** This endpoint will fail if the loan has already been taken or does not exist.

---

### Set Return Date

`POST /set-return-date/:key/:loan_code`

Marks a loan as returned by setting `returned_date` to the current timestamp. Also updates all associated items to `in_safe = true`, clears `currently_borrowing`, and sets `last_borrowed_person`. Therefore, keep in mind that you must not call other endpoints that will change the safe state of an item after or before calling this endpoint, otherwise the state of the items will be inconsistent.

**URL Parameters:**

- **key** - API key
- **loan_code** - A 6-digit numeric loan code

**Response 200:** Empty JSON object on success.

**Response 500:**

```json
{ "message": "Failed to set return date" }
```

> **Note:** This endpoint will fail if the loan has already been returned (i.e., `returned_date` is not `NULL`).

---

### Open Door

`GET /open-door/:key/:doorKey`

Toggles the safe state of an item identified by its door key and returns the associated safe number.

**URL Parameters:**

- **key** - API key
- **doorKey** - The door key identifier assigned to an item

**Response 200:**

```json
{
  "data": {
    "safe_nr": 3,
    "id": 1
  }
}
```

**Response 500:**

```json
{ "message": "Failed to open door" }
```

## Error Handling

All endpoints return a `500` status code for server-side failures and a JSON body with a `message` field, except for **Get Loan by Code** which returns `404` when no matching loan is found.
