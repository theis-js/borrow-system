use borrow_system_new;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  role int NOT NULL,
  is_admin bool NOT NULL DEFAULT false,
  entry_created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  entry_updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE loans (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL,
  lockers json NOT NULL DEFAULT ('[]'),
  loan_code Char(6) NOT NULL UNIQUE,
  start_date timestamp NOT NULL,
  end_date timestamp NOT NULL,
  take_date timestamp NULL DEFAULT NULL,
  returned_date timestamp NULL DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  loaned_items_id json NOT NULL DEFAULT ('[]'),
  loaned_items_name json NOT NULL DEFAULT ('[]'),
  deleted bool NOT NULL DEFAULT false,
  note varchar(500) DEFAULT NULL,
  PRIMARY KEY (id),
  CHECK (loan_code REGEXP '^[0-9]{6}$')
) ENGINE=InnoDB;

CREATE TABLE items (
  id int NOT NULL AUTO_INCREMENT,
  item_name varchar(255) NOT NULL UNIQUE,
  can_borrow_role INT NOT NULL,
  in_safe bool NOT NULL DEFAULT true,
  safe_nr CHAR(2) DEFAULT NULL,
  entry_created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  entry_updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_borrowed_person varchar(255) DEFAULT NULL,
  currently_borrowing varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CHECK (safe_nr REGEXP '^[0-9]{2}$' OR safe_nr IS NULL)
) ENGINE=InnoDB;

CREATE TABLE apiKeys (
  id INT NOT NULL AUTO_INCREMENT,
  api_key CHAR(8) NOT NULL UNIQUE,
  entry_name VARCHAR(100) NOT NULL,
  last_used_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  entry_created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CHECK (api_key REGEXP '^[0-9]{8}$')
) ENGINE=InnoDB;