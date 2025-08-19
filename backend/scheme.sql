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
  `loaned_items_name` json NOT NULL DEFAULT ('[]'),
  PRIMARY KEY (`id`),
  UNIQUE KEY `loan_code` (`loan_code`)
);

CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `can_borrow_role` INT NOT NULL,
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

-- Mock data for users
INSERT INTO `users` (`username`, `password`, `role`) VALUES
('alice', 'password1', 1),
('bob', 'password2', 2),
('carol', 'password3', 1),
('dave', 'password4', 3),
('eve', 'password5', 2),
('frank', 'password6', 1),
('grace', 'password7', 2),
('heidi', 'password8', 3),
('ivan', 'password9', 1),
('judy', 'password10', 2),
('mallory', 'password11', 1),
('oscar', 'password12', 3),
('peggy', 'password13', 2),
('trent', 'password14', 1),
('victor', 'password15', 2),
('wendy', 'password16', 3),
('zoe', 'password17', 1),
('quinn', 'password18', 2),
('ruth', 'password19', 1),
('sam', 'password20', 3);

-- Mock data for loans
INSERT INTO `loans` (`username`, `loan_code`, `start_date`, `end_date`, `returned_date`, `loaned_items_id`, `loaned_items_name`)
VALUES
('alice', 1001, '2025-08-01 09:00:00', '2025-08-10 09:00:00', NULL, '[1,2]', '["Laptop","Projector"]'),
('bob', 1002, '2025-08-02 10:00:00', '2025-08-12 10:00:00', NULL, '[3]', '["Tablet"]'),
('carol', 1003, '2025-08-03 11:00:00', '2025-08-13 11:00:00', NULL, '[4,5]', '["Camera","Tripod"]'),
('dave', 1004, '2025-08-04 12:00:00', '2025-08-14 12:00:00', NULL, '[6]', '["Microphone"]'),
('eve', 1005, '2025-08-05 13:00:00', '2025-08-15 13:00:00', NULL, '[7,8]', '["Speaker","Monitor"]'),
('frank', 1006, '2025-08-06 14:00:00', '2025-08-16 14:00:00', NULL, '[9]', '["Keyboard"]'),
('grace', 1007, '2025-08-07 15:00:00', '2025-08-17 15:00:00', NULL, '[10,11]', '["Mouse","Printer"]'),
('heidi', 1008, '2025-08-08 16:00:00', '2025-08-18 16:00:00', NULL, '[12]', '["Scanner"]'),
('ivan', 1009, '2025-08-09 17:00:00', '2025-08-19 17:00:00', NULL, '[13,14]', '["Router","Switch"]'),
('judy', 1010, '2025-08-10 18:00:00', '2025-08-20 18:00:00', NULL, '[15]', '["Projector"]'),
('mallory', 1011, '2025-08-11 09:00:00', '2025-08-21 09:00:00', NULL, '[16,17]', '["Laptop","Tablet"]'),
('oscar', 1012, '2025-08-12 10:00:00', '2025-08-22 10:00:00', NULL, '[18]', '["Camera"]'),
('peggy', 1013, '2025-08-13 11:00:00', '2025-08-23 11:00:00', NULL, '[19,20]', '["Tripod","Microphone"]'),
('trent', 1014, '2025-08-14 12:00:00', '2025-08-24 12:00:00', NULL, '[1]', '["Laptop"]'),
('victor', 1015, '2025-08-15 13:00:00', '2025-08-25 13:00:00', NULL, '[2,3]', '["Projector","Tablet"]'),
('wendy', 1016, '2025-08-16 14:00:00', '2025-08-26 14:00:00', NULL, '[4]', '["Camera"]'),
('zoe', 1017, '2025-08-17 15:00:00', '2025-08-27 15:00:00', NULL, '[5,6]', '["Tripod","Microphone"]'),
('quinn', 1018, '2025-08-18 16:00:00', '2025-08-28 16:00:00', NULL, '[7]', '["Speaker"]'),
('ruth', 1019, '2025-08-19 17:00:00', '2025-08-29 17:00:00', NULL, '[8,9]', '["Monitor","Keyboard"]'),
('sam', 1020, '2025-08-20 18:00:00', '2025-08-30 18:00:00', NULL, '[10]', '["Mouse"]');

-- Mock data for items
INSERT INTO `items` (`item_name`, `can_borrow_role`, `inSafe`) VALUES
('Laptop', 1, 1),
('Projector', 2, 1),
('Tablet', 1, 1),
('Camera', 2, 1),
('Tripod', 1, 1),
('Microphone', 3, 1),
('Speaker', 2, 1),
('Monitor', 1, 1),
('Keyboard', 2, 1),
('Mouse', 1, 1),
('Printer', 3, 1),
('Scanner', 2, 1),
('Router', 1, 1),
('Switch', 2, 1),
('Charger', 1, 1),
('USB Cable', 2, 1),
('HDMI Cable', 1, 1),
('Webcam', 3, 1),
('Headphones', 2, 1),
('Smartphone', 1, 1);

-- Mock data for lockers
INSERT INTO `lockers` (`item`, `locker_number`) VALUES
('Laptop', 101),
('Projector', 102),
('Tablet', 103),
('Camera', 104),
('Tripod', 105),
('Microphone', 106),
('Speaker', 107),
('Monitor', 108),
('Keyboard', 109),
('Mouse', 110),
('Printer', 111),
('Scanner', 112),
('Router', 113),
('Switch', 114),
('Charger', 115),
('USB Cable', 116),
('HDMI Cable', 117),
('Webcam', 118),
('Headphones', 119),
('Smartphone', 120);