-- Mock data for borrow_system_new
USE borrow_system_new;

START TRANSACTION;

-- Users
INSERT INTO users (username, password, email, first_name, last_name, role, is_admin, entry_created_at)
VALUES
('admin', '$2b$12$adminhashedpasswordplaceholder0000000000', 'admin@example.com', 'System', 'Admin', 99, TRUE, '2025-01-01 08:00:00'),
('alice', '$2b$12$alicehashedpasswordplaceholder0000000000', 'alice@example.com', 'Alice', 'Anderson', 1, FALSE, '2025-06-01 09:10:00'),
('bob',   '$2b$12$bobhashedpasswordplaceholder000000000000',   'bob@example.com',   'Bob',   'Brown',    2, FALSE, '2025-06-02 10:15:00'),
('carol', '$2b$12$carolhashedpasswordplaceholder00000000000',  'carol@example.com', 'Carol', 'Clark',   0, FALSE, '2025-06-03 11:20:00');

-- Items (ids will start at 1)
INSERT INTO items (item_name, can_borrow_role, in_safe, entry_created_at, last_borrowed_person, currently_borrowing)
VALUES
('MacBook Pro 16\"', 1, TRUE,  '2025-05-01 09:00:00', 'alice', NULL),
('Projector Epson X200', 2, TRUE, '2025-04-20 10:00:00', 'bob', NULL),
('Canon EOS R6', 1, TRUE,      '2025-03-15 14:30:00', NULL, NULL),
('Wireless Microphone', 0, TRUE,'2025-05-10 12:00:00', 'carol', NULL),
('USB-C Charger', 0, FALSE,    '2025-05-11 12:30:00', 'alice', 'alice');

-- Loans
INSERT INTO loans (username, loan_code, start_date, end_date, take_date, returned_date, created_at, loaned_items_id, loaned_items_name, deleted, note)
VALUES
('alice', '000101', '2025-06-10 09:00:00', '2025-06-17 09:00:00', '2025-06-10 09:05:00', NULL, '2025-06-10 09:00:00',
 JSON_ARRAY(1,5), JSON_ARRAY('MacBook Pro 16\"','USB-C Charger'), FALSE, 'For project work'),
('bob',   '000102', '2025-06-01 14:00:00', '2025-06-04 12:00:00', '2025-06-01 14:10:00', '2025-06-04 11:50:00', '2025-06-01 14:00:00',
 JSON_ARRAY(2), JSON_ARRAY('Projector Epson X200'), FALSE, NULL),
('carol', '000103', '2025-06-05 08:00:00', '2025-06-06 18:00:00', NULL, NULL, '2025-06-05 08:00:00',
 JSON_ARRAY(4), JSON_ARRAY('Wireless Microphone'), FALSE, 'Reserved for event');

-- API keys (15 digits)
INSERT INTO apiKeys (api_key, entry_name, entry_created_at, last_used_at)
VALUES
('000000000000001', 'internal-service-key', '2025-01-02 07:00:00', NULL),
('123456789012345', 'ci-pipeline', '2025-02-15 08:30:00', '2025-06-10 09:00:00');

COMMIT;