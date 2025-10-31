use borrow_system_new;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
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
  loan_code int NOT NULL UNIQUE,
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
  CONSTRAINT fk_loans_username
    FOREIGN KEY (username) REFERENCES users(username)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE items (
  id int NOT NULL AUTO_INCREMENT,
  item_name varchar(255) NOT NULL UNIQUE,
  can_borrow_role INT NOT NULL,
  in_safe bool NOT NULL DEFAULT true,
  entry_created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  entry_updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_borrowed_person varchar(255) DEFAULT NULL,
  currently_borrowing varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE apiKeys (
  id int NOT NULL AUTO_INCREMENT,
  api_key int NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,
  entry_created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_apikeys_username
    FOREIGN KEY (username) REFERENCES users(username)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;