# Backend API docs

If you want to cooperate with me, or build something new with my backend API, feel free to reach out!

On this page you will learn how my API works.

## General information

When you look at my backend folder and file structure, you can see that I have two files called `API`. The first file called `api.js` is for my web frontend, because this file works together with my JWT token service.

**\*But I have built a second API. You can see the second API file in the same directory, the file is called `apiV2.js`.**

This is the file that you can use to build an API.

But first you have to get the Admin API key, stored in an `.env` file on my server.

---

## Authentication

All endpoints require the Admin API key (`ADMIN_ID`) as a URL parameter.

Example: `/apiV2/items/{ADMIN_ID}`

---

## URL

- The frontend is currently running on `https://insta.the1s.de`.

- The backend is currently running on `https://backend.insta.the1s.de`.

You can see the status of this and all my other services at `https://status.the1s.de`.

---

## Current endpoints

### 1. Get All Items

**GET** `/apiV2/items/:key`

Returns a list of all items and their details.

#### Example Request

```
GET https://backend.insta.the1s.de/apiV2/items/your_admin_key
```

#### Example Response

```
{
  "data": [
    {
      "id": 1,
      "item_name": "DJI 1er Mikro",
      "can_borrow_role": 4,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 2,
      "item_name": "DJI 2er Mikro 1",
      "can_borrow_role": 4,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 3,
      "item_name": "DJI 2er Mikro 2",
      "can_borrow_role": 4,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 4,
      "item_name": "Rode Richt Mikrofon",
      "can_borrow_role": 2,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 5,
      "item_name": "Kamera Stativ",
      "can_borrow_role": 1,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 6,
      "item_name": "SONY Kamera - inkl. Akkus und Objektiv",
      "can_borrow_role": 1,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 7,
      "item_name": "MacBook inkl. Adapter",
      "can_borrow_role": 2,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 8,
      "item_name": "SD Karten",
      "can_borrow_role": 3,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 9,
      "item_name": "Kameragimbal",
      "can_borrow_role": 1,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 10,
      "item_name": "ATEM MINI PRO",
      "can_borrow_role": 1,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 11,
      "item_name": "Handygimbal",
      "can_borrow_role": 4,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 12,
      "item_name": "Kameralfter",
      "can_borrow_role": 1,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 13,
      "item_name": "Kleine Kamera 1 - inkl. Objektiv",
      "can_borrow_role": 2,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    },
    {
      "id": 14,
      "item_name": "Kleine Kamera 2 - inkl. Objektiv",
      "can_borrow_role": 2,
      "inSafe": 1,
      "entry_created_at": "2025-08-19T22:02:16.000Z"
    }
  ]
}
```

Each item has the following properties:

- `id`: The unique identifier for the item.
- `item_name`: The name of the item.
- `can_borrow_role`: The role ID that is allowed to borrow the item.
- `inSafe`: Indicates whether the item is currently in the locker (1) or not (0). This variable/state can change over time.

_You also get an http 200 status code._

---

### 2. Change Item Safe State

**POST** `/apiV2/controlInSafe/:key/:itemId/:state`

Updates the `inSafe` state of an item (whether it is in the locker).

- `state` must be `"1"` (in safe) or `"0"` (not in safe).

#### Example Request

```
POST https://backend.insta.the1s.de/apiV2/controlInSafe/your_admin_key/item_id/new_item_state
```

#### Example Response

```
{}
```

_An empty object means, that the operation was successful and no further information is returned._

_You also get an http 200 status code._

---

### 3. Set Return Date

**POST** `/apiV2/setReturnDate/:key/:loan_code`

Sets the `returned_date` of a loan to the current server time.

- `loan_code`: The unique code of the loan.

#### Example Request

```
POST https://backend.insta.the1s.de/apiV2/setReturnDate/your_admin_key/your_loan_code
```

#### Example Response

```
{}
```

_An empty object means, that the operation was successful and no further information is returned._

_You also get an http 200 status code._

---

### 4. Set Take Date

**POST** `/apiV2/setTakeDate/:key/:loan_code`

Sets the `take_date` of a loan to the current server time.

- `loan_code`: The unique code of the loan.

#### Example Request

```
POST https://backend.insta.the1s.de/apiV2/setTakeDate/your_admin_key/your_loan_code
```

#### Example Response

```
{}
```

_An empty object means, that the operation was successful and no further information is returned._

_You also get an http 2xx status code._

---

### 5. Get whole loan by loan code

**POST** `/getLoanByCode/:key/:loan_code`

Retrieves the details of a specific loan by its unique code.

- `loan_code`: The unique code of the loan.

#### Example Request

```
GET https://backend.insta.the1s.de/getLoanByCode/your_admin_key/your_loan_code
```

#### Example Response

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
    "loaned_items_id": [
      8,
      9
    ],
    "loaned_items_name": [
      "SD Karten",
      "Kameragimbal"
    ]
  }
}
```

_You also get an http 200 status code._

If the loan id does not exist, you will receive a 404 status code and an error message.

```
{
  "message": "Loan not found"
}
```

---

## Error Handling

- `403 Forbidden`: Invalid or missing API key.
- `400 Bad Request`: Invalid parameters (e.g., wrong state value).
- `500 Internal Server Error`: Database or server error.

---

If you have questions or want to collaborate, please reach out to me!
