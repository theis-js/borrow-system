-- MUST BE UPDATED BEFORE USE

USE borrow_system_new;

-- Optional: keep insert order predictable
SET time_zone = '+00:00';

-- Users
INSERT INTO users (username, password, first_name, last_name, role, is_admin)
VALUES
  ('alice',  'password123', 'Alice',  'Andersen', 1, false),
  ('bob',    'password123', 'Bob',    'Berg',     2, false),
  ('carol',  'password123', 'Carol',  'Christie', 2, false),
  ('dave',   'password123', 'Dave',   'Dawson',   1, false),
  ('eve',    'password123', 'Eve',    'Evans',    1, false),
  ('admin',  'password123', 'Admin',  'User',     3, true);

-- Items
INSERT INTO items (item_name, can_borrow_role, in_safe, last_borrowed_person, currently_borrowing)
VALUES
  ('Canon EOS 90D Camera',   1, false, 'bob',   'alice'),
  ('Rode NT1 Microphone',    1, true,  'dave',  NULL),
  ('MacBook Pro 13',         2, false, 'bob',   'carol'),
  ('Tripod Manfrotto',       1, false, 'carol', 'alice'),
  ('LED Panel Aputure',      1, true,  NULL,    NULL),
  ('Zoom H6 Recorder',       1, true,  'dave',  NULL),
  ('Wacom Intuos Tablet',    1, true,  NULL,    NULL),
  ('DJI Ronin-S Gimbal',     2, true,  NULL,    NULL),
  ('Sony A7 III Body',       2, false, 'carol', 'eve'),
  ('Sigma 24-70mm Lens',     2, false, 'carol', 'eve');

-- Capture item IDs for JSON arrays
SET @id_canon    = (SELECT id FROM items WHERE item_name='Canon EOS 90D Camera');
SET @id_rode     = (SELECT id FROM items WHERE item_name='Rode NT1 Microphone');
SET @id_mac13    = (SELECT id FROM items WHERE item_name='MacBook Pro 13');
SET @id_tripod   = (SELECT id FROM items WHERE item_name='Tripod Manfrotto');
SET @id_led      = (SELECT id FROM items WHERE item_name='LED Panel Aputure');
SET @id_zoom     = (SELECT id FROM items WHERE item_name='Zoom H6 Recorder');
SET @id_tablet   = (SELECT id FROM items WHERE item_name='Wacom Intuos Tablet');
SET @id_ronin    = (SELECT id FROM items WHERE item_name='DJI Ronin-S Gimbal');
SET @id_sony     = (SELECT id FROM items WHERE item_name='Sony A7 III Body');
SET @id_sigma    = (SELECT id FROM items WHERE item_name='Sigma 24-70mm Lens');

-- Loans
INSERT INTO loans (
  username, loan_code, start_date, end_date, take_date, returned_date, loaned_items_id, loaned_items_name, deleted
) VALUES
  -- Ongoing loan: Alice has Canon + Tripod
  ('alice', 100001, '2025-10-01 09:00:00', '2025-10-08 17:00:00', '2025-10-01 09:15:00', NULL,
    JSON_ARRAY(@id_canon, @id_tripod),
    JSON_ARRAY('Canon EOS 90D Camera','Tripod Manfrotto'),
    false
  ),
  -- Ongoing loan: Carol has MacBook Pro 13
  ('carol', 100002, '2025-10-03 10:00:00', '2025-10-10 16:00:00', '2025-10-03 10:05:00', NULL,
    JSON_ARRAY(@id_mac13),
    JSON_ARRAY('MacBook Pro 13'),
    false
  ),
  -- Returned loan: Dave had Zoom + Rode
  ('dave',  100003, '2025-09-10 08:30:00', '2025-09-12 16:00:00', '2025-09-10 08:45:00', '2025-09-12 15:40:00',
    JSON_ARRAY(@id_zoom, @id_rode),
    JSON_ARRAY('Zoom H6 Recorder','Rode NT1 Microphone'),
    false
  ),
  -- Cancelled/deleted booking (never taken): Bob reserved Tablet
  ('bob',   100004, '2025-10-05 09:00:00', '2025-10-06 09:00:00', NULL, NULL,
    JSON_ARRAY(@id_tablet),
    JSON_ARRAY('Wacom Intuos Tablet'),
    true
  ),
  -- Ongoing loan, likely overdue: Eve has Sony + Sigma
  ('eve',   100005, '2025-10-15 11:00:00', '2025-10-20 12:00:00', '2025-10-15 11:10:00', NULL,
    JSON_ARRAY(@id_sony, @id_sigma),
    JSON_ARRAY('Sony A7 III Body','Sigma 24-70mm Lens'),
    false
  ),
  -- Completed single-day loan: Bob used LED panel
  ('bob',   100006, '2025-09-20 13:00:00', '2025-09-20 18:00:00', '2025-09-20 13:05:00', '2025-09-20 17:30:00',
    JSON_ARRAY(@id_led),
    JSON_ARRAY('LED Panel Aputure'),
    false
  );

-- API keys
INSERT INTO apiKeys (api_key, username)
VALUES
  (71002123, 'alice'),
  (71002124, 'bob'),
  (71002125, 'carol'),
  (99999999, 'admin');