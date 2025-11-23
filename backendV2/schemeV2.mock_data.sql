USE borrow_system_new;

-- Reset tables (no FKs defined, so order is safe)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE loans;
TRUNCATE TABLE apiKeys;
TRUNCATE TABLE items;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Users (roles 1–6, plain-text passwords; is_admin is BOOL)
INSERT INTO users (username, password, email, first_name, last_name, role, is_admin) VALUES
('admin',  'adminpass', 'admin@example.com',  'System', 'Admin',   6, TRUE),
('alice',  'alice123',  'alice@example.com',  'Alice',  'Andersen',1, FALSE),
('bob',    'bob12345',  'bob@example.com',    'Bob',    'Berg',    2, FALSE),
('carol',  'carol123',  'carol@example.com',  'Carol',  'Christensen', 3, FALSE),
('dave',   'dave123',   'dave@example.com',   'Dave',   'Dahl',    4, FALSE),
('erin',   'erin123',   'erin@example.com',   'Erin',   'Enevoldsen', 5, FALSE),
('frank',  'frank123',  'frank@example.com',  'Frank',  'Fisher',  2, FALSE),
('grace',  'grace123',  'grace@example.com',  'Grace',  'Gundersen',1, FALSE),
('heidi',  'heidi123',  'heidi@example.com',  'Heidi',  'Hansen',  4, FALSE),
('tech',   'techpass',  'tech@example.com',   'Tech',   'User',    5, TRUE);

-- Items (safe_nr is two digits or NULL; matches CHECK and UNIQUE constraint)
INSERT INTO items (item_name, can_borrow_role, in_safe, safe_nr, last_borrowed_person, currently_borrowing) VALUES
('Laptop A',           2, FALSE, NULL, 'grace',  'bob'),
('Laptop B',           2, TRUE,  '01', NULL,     NULL),
('Camera Canon',       3, TRUE,  '02', 'erin',   NULL),
('Microphone Rode',    1, TRUE,  '03', 'grace',  NULL),
('Tripod Manfrotto',   1, TRUE,  '04', 'frank',  NULL),
('Oscilloscope Tek',   4, TRUE,  '05', NULL,     NULL),
('VR Headset',         3, FALSE, NULL, 'heidi',  'carol'),
('Keycard Programmer', 6, TRUE,  '06', 'admin',  NULL);

-- Loans (JSON strings, 6-digit numeric loan_code per CHECK)
-- Assumes the items above have ids 1..8 in insert order
INSERT INTO loans (
  username,
  lockers,
  loan_code,
  start_date,
  end_date,
  take_date,
  returned_date,
  loaned_items_id,
  loaned_items_name,
  deleted,
  note
) VALUES
-- Active loan: bob has Laptop A (item id 1, locker "01")
('bob',
  '["01"]',
  '123456',
  '2025-11-15 09:00:00',
  '2025-11-22 17:00:00',
  '2025-11-15 09:15:00',
  NULL,
  '[1]',
  '["Laptop A"]',
  FALSE,
  'Active loan - Laptop A'
),
-- Returned loan: frank had Tripod Manfrotto (item id 5, locker "04")
('frank',
  '["04"]',
  '234567',
  '2025-10-01 10:00:00',
  '2025-10-07 16:00:00',
  '2025-10-01 10:05:00',
  '2025-10-05 15:30:00',
  '[5]',
  '["Tripod Manfrotto"]',
  FALSE,
  'Completed loan'
),
-- Future reservation: dave will take Oscilloscope Tek (item id 6, locker "05")
('dave',
  '["05"]',
  '345678',
  '2025-12-10 09:00:00',
  '2025-12-12 17:00:00',
  NULL,
  NULL,
  '[6]',
  '["Oscilloscope Tek"]',
  FALSE,
  'Reserved'
),
-- Active loan: carol has VR Headset (item id 7, locker "02")
('carol',
  '["02"]',
  '456789',
  '2025-11-10 13:00:00',
  '2025-11-20 12:00:00',
  '2025-11-10 13:10:00',
  NULL,
  '[7]',
  '["VR Headset"]',
  FALSE,
  'Active loan - VR Headset'
),
-- Soft-deleted historic loan: grace had Microphone + Tripod (item ids 4,5; lockers "03","04")
('grace',
  '["03","04"]',
  '567890',
  '2025-09-01 09:00:00',
  '2025-09-03 17:00:00',
  '2025-09-01 09:10:00',
  '2025-09-03 16:45:00',
  '[4,5]',
  '["Microphone Rode","Tripod Manfrotto"]',
  TRUE,
  'Canceled/soft-deleted record'
);

-- API keys (8-digit numeric keys per CHECK)
INSERT INTO apiKeys (api_key, entry_name, last_used_at) VALUES
('12345678', 'CI token',     '2025-11-15 08:00:00'),
('87654321', 'Local dev',    NULL),
('00000001', 'Monitoring',   '2025-11-10 12:30:00');