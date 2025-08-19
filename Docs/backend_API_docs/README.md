# Backend API docs

If you want to coorperate with me, or build something new with my backend API, feel free to reach out!

On this page you will learn how my API works.

## General information

When you look at my backend folder and file structure, yu can see that I have two files called `API`. The first file called `api.js` is for my web frontend. Because this file works together with my JWT token service.

But I have build a second API. You can see the second API file in the same directory, the file is called `apiV2.js`.

This is the file that you can use to build an API.

But first you have to get the Admin API key, stored in an .env file on my server.

### Current endpoints

- /apiV2/items/`secretKey`

#### /apiV2/items/

When you call this API you will get like this result back:

```
[
  {
    "id": 1,
    "item_name": "DJI 1er Mikro",
    "can_borrow_role": "4",
    "inSafe": 1
  },
  {
    "id": 2,
    "item_name": "DJI 2er Mikro 1",
    "can_borrow_role": "4",
    "inSafe": 1
  },
  {
    "id": 3,
    "item_name": "DJI 2er Mikro 2",
    "can_borrow_role": "4",
    "inSafe": 1
  },
  {
    "id": 5,
    "item_name": "Rode Richt Mikrofon",
    "can_borrow_role": "2",
    "inSafe": 1
  },
  {
    "id": 6,
    "item_name": "Kamera Stativ",
    "can_borrow_role": "1",
    "inSafe": 1
  },
  {
    "id": 7,
    "item_name": "SONY Kamera - inkl. Akkus und Objektiv",
    "can_borrow_role": "1",
    "inSafe": 1
  },
  {
    "id": 8,
    "item_name": "MacBook inkl. Adapter",
    "can_borrow_role": "2",
    "inSafe": 1
  },
  {
    "id": 9,
    "item_name": "SD Karten",
    "can_borrow_role": "3",
    "inSafe": 1
  },
  {
    "id": 10,
    "item_name": "Kameragimbal",
    "can_borrow_role": "1",
    "inSafe": 1
  },
  {
    "id": 11,
    "item_name": "ATEM MINI PRO",
    "can_borrow_role": "1",
    "inSafe": 1
  },
  {
    "id": 12,
    "item_name": "Handygimbal",
    "can_borrow_role": "4",
    "inSafe": 1
  },
  {
    "id": 13,
    "item_name": "Kameralüfter",
    "can_borrow_role": "1",
    "inSafe": 1
  },
  {
    "id": 14,
    "item_name": "Kleine Kamera 1 - inkl. Objektiv",
    "can_borrow_role": "2",
    "inSafe": 1
  },
  {
    "id": 15,
    "item_name": "Kleine Kamera 2 - inkl. Objektiv",
    "can_borrow_role": "2",
    "inSafe": 1
  }
]
```

There you can see all items and their details.

Each item has the following properties:

- `id`: The unique identifier for the item.
- `item_name`: The name of the item.
- `can_borrow_role`: The role ID that is allowed to borrow the item.
- `inSafe`: Indicates whether the item is currently in the locker (1) or not (0).
