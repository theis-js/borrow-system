CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL UNIQUE,
    can_borrow_role VARCHAR(255) NOT NULL
);

CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    loan_code INT(6) NOT NULL UNIQUE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    returned_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lockers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(255) NOT NULL UNIQUE,
    locker_number INT NOT NULL UNIQUE
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