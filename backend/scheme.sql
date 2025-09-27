-- All necessary tables for the borrowing system

-- IMPORTANT: You need mySQL version 8.0 or newer!

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int DEFAULT NULL,
  `entry_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `entry_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `loans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `loan_code` int NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `take_date` timestamp NULL DEFAULT NULL,
  `returned_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `loaned_items_id` json NOT NULL DEFAULT ('[]'),
  `loaned_items_name` json NOT NULL DEFAULT ('[]'),
  PRIMARY KEY (`id`),
  UNIQUE KEY `loan_code` (`loan_code`)
);

CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `can_borrow_role` INT NOT NULL,
  `inSafe` tinyint(1) NOT NULL DEFAULT '1',
  `entry_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_name` (`item_name`)
);

CREATE TABLE `lockers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item` varchar(255) NOT NULL,
  `locker_number` int NOT NULL,
  `entry_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item` (`item`),
  UNIQUE KEY `locker_number` (`locker_number`)
);

CREATE TABLE `apiKeys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `apiKey` int NOT NULL UNIQUE,
  `user` VARCHAR(255) NOT NULL,
  `entry_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `apiKey` (`apiKey`)
);

INSERT INTO `items` (`item_name`, `can_borrow_role`, `inSafe`) VALUES
('DJI 1er Mikro', 4, 1),
('DJI 2er Mikro 1', 4, 1),
('DJI 2er Mikro 2', 4, 1),
('Rode Richt Mikrofon', 2, 1),
('Kamera Stativ', 1, 0),
('SONY Kamera - inkl. Akkus und Objektiv', 1, 1),
('MacBook inkl. Adapter', 2, 0),
('SD Karten', 3, 0),
('Kameragimbal', 1, 0),
('ATEM MINI PRO', 1, 1),
('Handygimbal', 4, 0),
('Kameralüfter', 1, 1),
('Kleine Kamera 1 - inkl. Objektiv', 2, 1),
('Kleine Kamera 2 - inkl. Objektiv', 2, 1);

INSERT INTO `lockers` (`item`, `locker_number`) VALUES
('DJI 1er Mikro', 1),
('DJI 2er Mikro 1', 2),
('DJI 2er Mikro 2', 3),
('Rode Richt Mikrofon', 4),
('Kamera Stativ', 5),
('SONY Kamera - inkl. Akkus und Objektiv', 6),
('MacBook inkl. Adapter', 7),
('SD Karten', 8),
('Kameragimbal', 9),
('ATEM MINI PRO', 10),
('Handygimbal', 11),
('Kameralüfter', 12),
('Kleine Kamera 1 - inkl. Objektiv', 13),
('Kleine Kamera 2 - inkl. Objektiv', 14);