# Backend API docs

If you want to cooperate with me, or build something new with my backend API, feel free to reach out!

On this page you will learn how my API works.

## General information

When you look at my backend folder and file structure, you can see that I have two files called `API`. The first file called `api.js` which is for my web frontend, because this file works together with my JWT token service.

But I have built a second API. You can see the second API file in the same directory, the file is called `api.route.js` and `api.database.js`.

But first you have to get an API Key. You can get the API key from my admin dashboard. When you don't have any access to my admin dashboard, please contact your administrator or me.

---

## Base URL

- Frontend: `https://insta.the1s.de`
- Backend: `https://backend.insta.the1s.de`
- Base path for this API: `https://backend.insta.the1s.de/api`

You can see the status of this and all my other services at `https://status.the1s.de`.

_I have also build a [fallback page](https://git.the1s.de/theis.gaedigk/fallback-page). When only the application is down, you will see a friendly message and a link to the status page. (Only if the server is not down)_

---

## Authentication

All endpoints require an API key as a path parameter named `:key`.

**The API key must be always 15 characters long and can only contain numbers.**

You can get the API key from the admin dashboard.

Example: `/api/items/:key`

If the key is missing or invalid, the API responds with `401 Unauthorized`.

### Files

**You can find the authentication files here:**

- `backendV2/services/authentication.js`
- `backendV2/services/database.js`

**The API routes are located here:**

- `backendV2/routes/api/api.route.js`
- `backendV2/services/api/api.database.js`

---

## Endpoints

### 1) Get all items

GET `/api/items/:key`

Returns a list of all items wrapped in a `data` object.

Example request:

```
GET https://backend.insta.the1s.de/api/items/12345
```

Example response:

```
{
  "data": [
    {
      "id": 1,
      "item_name": "DJI 1er Mikro",
      "can_borrow_role": 4,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    }
  ]
}
```

Fields:

- `id`: Unique identifier
- `item_name`: Item name
- `can_borrow_role`: Role allowed to borrow
- `inSafe`: 1 if in locker, 0 otherwise
- `entry_created_at`: Creation timestamp

Status: 200 on success, 500 on failure.

---

### 2) Change item safe state

POST `/api/controlInSafe/:key/:itemId/:state`

Updates `inSafe` (locker) state of an item.

- `state` must be `"1"` (in safe) or `"0"` (not in safe)

Example request:

```
POST https://backend.insta.the1s.de/api/controlInSafe/12345/123/1
```

Example response (shape depends on database service):

```
{ "data": { /* update result */ } }
```

Status:

- 200 on success
- 400 if `state` is invalid
- 500 on failure

**You can get the item id on the admin panel, from your system administrator.**

---

### 3) Get loan by code

GET `/api/getLoanByCode/:key/:loan_code`

Retrieves the details of a specific loan.

Example request:

```
GET https://backend.insta.the1s.de/api/getLoanByCode/12345/123456
```

Example response:

```
{
  "data": {
    "id": 6,
    "username": "theis",
    "loan_code": 646473,
    "start_date": "2025-08-25T13:23:00.000Z",
    "end_date": "2025-08-26T13:23:00.000Z",
    "take_date": null,
    "returned_date": null,
    "created_at": "2025-08-20T11:23:40.000Z",
    "loaned_items_id": [8, 9],
    "loaned_items_name": ["SD Karten", "Kameragimbal"]
  }
}
```

Status:

- 200 on success
- 404 if not found

---

### 4) Set return date (now) by loan code

POST `/api/setReturnDate/:key/:loan_code`

Sets the `returned_date` to the current server time.

**Note:** I have updated this API route, so that everytime you return or take a loan, the state of the loaned items is automatically updated.

**DO NOT UPDATE THE STATE MANUALLY! (only if the item was taken with an admin key)**

Example request:

```
POST https://backend.insta.the1s.de/api/setReturnDate/12345/123456
```

Example response:

```
{ "data": { /* update result */ } }
```

Status: 200 on success, 500 on failure.

---

### 5) Set take date (now) by loan code

POST `/api/setTakeDate/:key/:loan_code`

Sets the `take_date` to the current server time.

**Note:** I have updated this API route, so that everytime you return or take a loan, the state of the loaned items is automatically updated.

**DO NOT UPDATE THE STATE MANUALLY! (only if the item was taken with an admin key)**

Example request:

```
POST https://backend.insta.the1s.de/api/setTakeDate/12345/123456
```

Example response:

```
{ "data": { /* update result */ } }
```

Status: 200 on success, 500 on failure.

---

## Error handling

- 401 Unauthorized: Missing or invalid API key
- 400 Bad Request: Invalid parameters (e.g., wrong state value)
- 404 Not Found: Loan not found
- 500 Internal Server Error: Database or server error

---

If you have questions or want to collaborate, please reach out!
