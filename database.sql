-- Create the database
CREATE DATABASE   store_rating_db;
USE  store_rating_db;

-- Disable foreign key checks temporarily to avoid issues during table creation
-- Disable foreign key checks temporarily to avoid issues during table creation
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS users;

--
-- Table structure for table `users`
--
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Stored as bcrypt hash
    address VARCHAR(255) NOT NULL,
    -- Role will be 'Normal', 'StoreOwner', or 'Admin'
    role ENUM('Normal', 'StoreOwner', 'Admin') NOT NULL DEFAULT 'Normal',
    -- storeId is NULLABLE as only StoreOwners will have one
    -- This links a user to a store if they are a StoreOwner.
    storeId INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE SET NULL
);

-- Add indexes for faster lookups on commonly queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_storeId ON users(storeId);


--
-- Table structure for table `stores`
--
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- Store email
    address VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(2048) NULL, -- URL for store image, can be null
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add index on email for faster lookups
CREATE INDEX idx_stores_email ON stores(email);


--
-- Table structure for table `ratings`
--
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    storeId INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Rating must be between 1 and 5
    comment TEXT NULL, -- Optional comment for the rating
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints with ON DELETE CASCADE
    -- If a user is deleted, all their associated ratings are also deleted.
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    -- If a store is deleted, all its associated ratings are also deleted.
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE
);

-- Add indexes for faster lookups on foreign keys
CREATE INDEX idx_ratings_userId ON ratings(userId);
CREATE INDEX idx_ratings_storeId ON ratings(storeId);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;


--
-- Initial Test Data (Optional, but highly recommended for development)
--
-- IMPORTANT: Replace 'your_hashed_password_here' with actual bcrypt hashes.
-- For simple testing, you can temporarily modify your backend's registration logic
-- to print the hash it generates for 'password123', or use a tool to generate it.
-- Using 'password123' as an example for clarity in comments.
-- For production, NEVER store plain passwords.

--