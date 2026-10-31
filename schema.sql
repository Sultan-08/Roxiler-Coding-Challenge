-- 1. CREATE DATABASE

CREATE DATABASE IF NOT EXISTS roxiler_app;
USE roxiler_app;

-- 2. CREATE USERS TABLE

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

-- 3. CREATE STORES TABLE

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

-- 4. CREATE RATINGS TABLE

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

-- 5. CREATE AUDIT LOGS TABLE

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    record_id INT NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CREATE AUDIT TRIGGERS


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

