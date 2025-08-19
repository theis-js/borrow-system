-- All necessary tables for the borrowing system

-- IMPORTANT: You need mySQL version 8.0 or newer!

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `loans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `loan_code` int NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `returned_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `loaned_items_id` json NOT NULL DEFAULT ('[]'),
  PRIMARY KEY (`id`),
  UNIQUE KEY `loan_code` (`loan_code`)
);

CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `can_borrow_role` varchar(255) NOT NULL,
  `inSafe` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_name` (`item_name`)
);

CREATE TABLE `lockers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item` varchar(255) NOT NULL,
  `locker_number` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item` (`item`),
  UNIQUE KEY `locker_number` (`locker_number`)
);

-- Mock data

-- Users
INSERT INTO users (username, password) VALUES
('alice', 'password123'),
('bob', 'securepass'),
('charlie', 'charliepwd');

-- Items
INSERT INTO items (item_name, can_borrow_role) VALUES
('Laptop', 'student'),
('Projector', 'teacher'),
('Tablet', 'student,teacher');

-- Loans
INSERT INTO loans (username, loan_code, start_date, end_date, returned_date) VALUES
('alice', 100001, '2025-08-01 09:00:00', '2025-08-10 17:00:00', NULL),
('bob', 100002, '2025-08-05 10:00:00', '2025-08-12 15:00:00', '2025-08-12 14:30:00'),
('charlie', 100003, '2025-08-07 11:00:00', '2025-08-15 16:00:00', NULL);

-- Lockers
INSERT INTO lockers (item, locker_number) VALUES
('Laptop', 101),
('Projector', 102),
('Tablet', 103);