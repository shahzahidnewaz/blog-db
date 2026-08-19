const mysql = require("mysql2/promise");
require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

let pool;

async function initDb() {
  const rootConn = await mysql.createConnection({
    host: DB_HOST || "localhost",
    user: DB_USER || "root",
    password: DB_PASSWORD || "",
    port: DB_PORT || 3306,
  });

  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME || "blogdb"}\``);
  await rootConn.end();

  pool = mysql.createPool({
    host: DB_HOST || "localhost",
    user: DB_USER || "root",
    password: DB_PASSWORD || "",
    database: DB_NAME || "blogdb",
    port: DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
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
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      blogTitle VARCHAR(255) NOT NULL,
      blog TEXT NOT NULL,
      category VARCHAR(100),
      createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  return pool;
}

function getPool() {
  if (!pool) throw new Error("DB not initialized yet. Call initDb() first.");
  return pool;
}

module.exports = { initDb, getPool };
