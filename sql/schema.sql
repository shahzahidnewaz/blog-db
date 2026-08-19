-- Run this once to create the database, or let the app auto-create it (config/db.js does this too)
CREATE DATABASE IF NOT EXISTS blogdb;
USE blogdb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  role VARCHAR(20) DEFAULT 'user',
  createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  blogTitle VARCHAR(255) NOT NULL,
  blog TEXT NOT NULL,
  category VARCHAR(100),
  createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- To promote a user to admin manually:
-- UPDATE users SET role = 'admin' WHERE email = 'someone@example.com';
