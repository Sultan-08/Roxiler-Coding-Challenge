-- 1. CREATE DATABASE

CREATE DATABASE IF NOT EXISTS roxiler_app;

USE roxiler_app;

-- 2. DROP EXISTING TABLES

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS users;


-- 3. CREATE USERS TABLE

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER')
        NOT NULL DEFAULT 'NORMAL_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CHECK (CHAR_LENGTH(name) >= 20)
);


-- 4. CREATE STORES TABLE

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- 5. CREATE RATINGS TABLE

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE (user_id, store_id),

    CHECK (rating BETWEEN 1 AND 5),

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (store_id) REFERENCES stores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- 6. CREATE AUDIT LOGS TABLE

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    record_id INT NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 7. CREATE AUDIT TRIGGERS

DELIMITER $$


-- USERS TABLE TRIGGERS

CREATE TRIGGER users_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, new_data)
    VALUES (
        'users',
        'INSERT',
        NEW.id,
        JSON_OBJECT(
            'id', NEW.id,
            'name', NEW.name,
            'email', NEW.email,
            'role', NEW.role,
            'address', NEW.address
        )
    );
END$$


CREATE TRIGGER users_after_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, old_data, new_data)
    VALUES (
        'users',
        'UPDATE',
        NEW.id,
        JSON_OBJECT(
            'id', OLD.id,
            'name', OLD.name,
            'email', OLD.email,
            'role', OLD.role,
            'address', OLD.address
        ),
        JSON_OBJECT(
            'id', NEW.id,
            'name', NEW.name,
            'email', NEW.email,
            'role', NEW.role,
            'address', NEW.address
        )
    );
END$$


CREATE TRIGGER users_after_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, old_data)
    VALUES (
        'users',
        'DELETE',
        OLD.id,
        JSON_OBJECT(
            'id', OLD.id,
            'name', OLD.name,
            'email', OLD.email,
            'role', OLD.role,
            'address', OLD.address
        )
    );
END$$


-- STORES TABLE TRIGGERS

CREATE TRIGGER stores_after_insert
AFTER INSERT ON stores
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, new_data)
    VALUES (
        'stores',
        'INSERT',
        NEW.id,
        JSON_OBJECT(
            'id', NEW.id,
            'owner_id', NEW.owner_id,
            'name', NEW.name,
            'email', NEW.email,
            'address', NEW.address
        )
    );
END$$


CREATE TRIGGER stores_after_update
AFTER UPDATE ON stores
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, old_data, new_data)
    VALUES (
        'stores',
        'UPDATE',
        NEW.id,
        JSON_OBJECT(
            'id', OLD.id,
            'owner_id', OLD.owner_id,
            'name', OLD.name,
            'email', OLD.email,
            'address', OLD.address
        ),
        JSON_OBJECT(
            'id', NEW.id,
            'owner_id', NEW.owner_id,
            'name', NEW.name,
            'email', NEW.email,
            'address', NEW.address
        )
    );
END$$


CREATE TRIGGER stores_after_delete
AFTER DELETE ON stores
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, old_data)
    VALUES (
        'stores',
        'DELETE',
        OLD.id,
        JSON_OBJECT(
            'id', OLD.id,
            'owner_id', OLD.owner_id,
            'name', OLD.name,
            'email', OLD.email,
            'address', OLD.address
        )
    );
END$$


-- RATINGS TABLE TRIGGERS

CREATE TRIGGER ratings_after_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, new_data)
    VALUES (
        'ratings',
        'INSERT',
        NEW.id,
        JSON_OBJECT(
            'id', NEW.id,
            'user_id', NEW.user_id,
            'store_id', NEW.store_id,
            'rating', NEW.rating
        )
    );
END$$


CREATE TRIGGER ratings_after_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, old_data, new_data)
    VALUES (
        'ratings',
        'UPDATE',
        NEW.id,
        JSON_OBJECT(
            'id', OLD.id,
            'user_id', OLD.user_id,
            'store_id', OLD.store_id,
            'rating', OLD.rating
        ),
        JSON_OBJECT(
            'id', NEW.id,
            'user_id', NEW.user_id,
            'store_id', NEW.store_id,
            'rating', NEW.rating
        )
    );
END$$


CREATE TRIGGER ratings_after_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action_type, record_id, old_data)
    VALUES (
        'ratings',
        'DELETE',
        OLD.id,
        JSON_OBJECT(
            'id', OLD.id,
            'user_id', OLD.user_id,
            'store_id', OLD.store_id,
            'rating', OLD.rating
        )
    );
END$$


DELIMITER ;


-- 8. INSERT SAMPLE USERS


INSERT INTO users (id, name, email, password_hash, address, role)
VALUES
(2, 'Sultan System Administrator', 'sultan.admin@roxiler.com',
 '$2b$10$n8VFEXvn3Aj6QfZA9Xmegul4UJLJD6hvXnKdVjMAzg/RMGeuNZzTG',
 'Central Admin Plaza, Pune City', 'SYSTEM_ADMIN'),

(3, 'Alex Store Owner Account', 'alex.owner@example.com',
 '$2b$10$8WqvIggQkWXMBrRTuPXRMeSck6P72imwRQhzUAUmmvuV1xH7t/Hri',
 'Pune, Maharashtra, India', 'STORE_OWNER'),

(4, 'Alex Regular Customer User', 'alex.customer@example.com',
 '$2b$10$x5NHx8RPTOWE36Y41IPPKOR3CIYYpZO1IJNbtmKUVRb8di8sck67.',
 'Hinjewadi, Pune, India', 'NORMAL_USER'),

(5, 'Alex Regular User Account', 'alex.user@example.com',
 '$2b$10$UUZdpF4ISbrKL4BUx5hF.unsEIFDZBhtAtniXbhtfYaCDGHeuY4em',
 'Jodhpur, India', 'NORMAL_USER');


-- 9. INSERT SAMPLE STORES

INSERT INTO stores (id, owner_id, name, email, address)
VALUES
(2, NULL, 'Alex Central Retail Store',
 'alex.store@example.com', 'Pune, India'),

(3, 3, 'Alex Corner Grocery Store',
 'alex.owner@example.com', 'Pune, Hinjewadi'),

(4, NULL, 'Alex Marketplace Store',
 'alex.market@example.com', 'Jodhpur, India');


-- 10. INSERT SAMPLE RATINGS

INSERT INTO ratings (id, user_id, store_id, rating)
VALUES
(1, 4, 2, 4),
(7, 4, 3, 5),
(10, 5, 4, 3),
(11, 5, 2, 2),
(12, 5, 3, 3),
(13, 4, 4, 2);


-- 11. VERIFY DATABASE

SHOW TABLES;

SELECT * FROM users;
SELECT * FROM stores;
SELECT * FROM ratings;
SELECT * FROM audit_logs;
