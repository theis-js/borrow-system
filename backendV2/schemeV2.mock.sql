USE borrow_system_new;

-- USERS
INSERT INTO users (username, password, email, first_name, last_name, role, is_admin)
VALUES
  ('user1', 'passwordhash1', 'user1@example.com', 'First1', 'Last1', 1, false),
  ('user2', 'passwordhash2', 'user2@example.com', 'First2', 'Last2', 1, false),
  ('user3', 'passwordhash3', 'user3@example.com', 'First3', 'Last3', 2, false),
  ('admin1', 'passwordhash4', 'admin1@example.com', 'Admin',  'One',  9, true),
  ('admin2', 'passwordhash5', 'admin2@example.com', 'Admin',  'Two',  9, true);

-- ITEMS
INSERT INTO items (item_name, can_borrow_role, in_safe, safe_nr, door_key, last_borrowed_person, currently_borrowing)
VALUES
  ('Item1', 1, true,  1, 101, NULL, NULL),
  ('Item2', 1, true,  2, 102, 'user1', 'user1'),
  ('Item3', 2, true,  3, 103, 'user2', NULL),
  ('Item4', 1, false, NULL, NULL, NULL, NULL),
  ('Item5', 2, false, NULL, NULL, 'user3', 'user3');

-- LOANS
INSERT INTO loans (
  username,
  lockers,
  loan_code,
  start_date,
  end_date,
  take_date,
  returned_date,
  created_at,
  loaned_items_id,
  loaned_items_name,
  deleted,
  note
)
VALUES
  (
    'user1',
    JSON_ARRAY('Locker1', 'Locker2'),
    '123456',
    '2026-02-01 09:00:00',
    '2026-02-10 17:00:00',
    '2026-02-01 09:15:00',
    NULL,
    '2026-02-01 09:00:00',
    JSON_ARRAY(1, 2),
    JSON_ARRAY('Item1', 'Item2'),
    false,
    'Erste allgemeine Ausleihe'
  ),
  (
    'user2',
    JSON_ARRAY('Locker3'),
    '234567',
    '2026-02-02 10:00:00',
    '2026-02-05 16:00:00',
    '2026-02-02 10:05:00',
    '2026-02-05 15:30:00',
    '2026-02-02 10:00:00',
    JSON_ARRAY(3),
    JSON_ARRAY('Item3'),
    false,
    'Zurückgegeben vor Enddatum'
  ),
  (
    'user3',
    JSON_ARRAY(),
    '345678',
    '2026-02-03 08:30:00',
    '2026-02-15 18:00:00',
    NULL,
    NULL,
    '2026-02-03 08:30:00',
    JSON_ARRAY(5),
    JSON_ARRAY('Item5'),
    false,
    'Noch ausgeliehen'
  ),
  (
    'user1',
    JSON_ARRAY('Locker4'),
    '456789',
    '2025-12-01 09:00:00',
    '2025-12-03 17:00:00',
    '2025-12-01 09:10:00',
    '2025-12-03 16:45:00',
    '2025-12-01 09:00:00',
    JSON_ARRAY(1),
    JSON_ARRAY('Item1'),
    true,
    'Alte, gelöschte Ausleihe'
  );

-- API KEYS
INSERT INTO apiKeys (api_key, entry_name)
VALUES
  ('10000001', 'Entry1'),
  ('10000002', 'Entry2'),
  ('10000003', 'Entry3'),
  ('10000004', 'Entry4');