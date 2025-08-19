# Backend API docs

If you want to cooperate with me, or build something new with my backend API, feel free to reach out!

On this page you will learn how my API works.

## General information

When you look at my backend folder and file structure, you can see that I have two files called `API`. The first file called `api.js` is for my web frontend, because this file works together with my JWT token service.

But I have built a second API. You can see the second API file in the same directory, the file is called `apiV2.js`.

This is the file that you can use to build an API.

But first you have to get the Admin API key, stored in an `.env` file on my server.

---

## Authentication

All endpoints require the Admin API key (`ADMIN_ID`) as a URL parameter.

Example: `/apiV2/items/{ADMIN_ID}`

---

## Current endpoints

### 1. Get All Items

**GET** `/apiV2/items/:key`

Returns a list of all items and their details.

#### Example Request

```
GET /apiV2/items/your_admin_key
```

#### Example Response

```
[
  {
    "id": 1,
    "item_name": "DJI 1er Mikro",
    "can_borrow_role": "4",
    "inSafe": 1
  },
  ...
]
```

Each item has the following properties:

- `id`: The unique identifier for the item.
- `item_name`: The name of the item.
- `can_borrow_role`: The role ID that is allowed to borrow the item.
- `inSafe`: Indicates whether the item is currently in the locker (1) or not (0).

---

### 2. Change Item Safe State

**POST** `/apiV2/controlInSafe/:key/:itemId/:state`

Updates the `inSafe` state of an item (whether it is in the locker).

- `state` must be `"1"` (in safe) or `"0"` (not in safe).

#### Example Request

```
POST /apiV2/controlInSafe/your_admin_key/5/0
```

#### Example Response

```
{}
```

---

### 3. Set Return Date

**POST** `/apiV2/setReturnDate/:key/:loan_code`

Sets the `returned_date` of a loan to the current server time.

- `loan_code`: The unique code of the loan.

#### Example Request

```
POST /apiV2/setReturnDate/your_admin_key/123456
```

#### Example Response

```
{}
```

---

### 4. Set Take Date

**POST** `/apiV2/setTakeDate/:key/:loan_code`

Sets the `take_date` of a loan to the current server time.

- `loan_code`: The unique code of the loan.

#### Example Request

```
POST /apiV2/setTakeDate/your_admin_key/123456
```

#### Example Response

```
{}
```

---

## Error Handling

- `403 Forbidden`: Invalid or missing API key.
- `400 Bad Request`: Invalid parameters (e.g., wrong state value).
- `500 Internal Server Error`: Database or server error.

---

If you have questions or want to collaborate, please reach out to me!
