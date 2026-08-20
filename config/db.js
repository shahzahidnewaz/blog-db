const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(
  DB_NAME || "blogdb",
  DB_USER || "root",
  DB_PASSWORD || "",
  {
    host: DB_HOST || "localhost",
    port: DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

async function initDb() {
  // Connect without a database first, to create it if missing
  const rootConn = await mysql.createConnection({
    host: DB_HOST || "localhost",
    user: DB_USER || "root",
    password: DB_PASSWORD || "",
    port: DB_PORT || 3306,
  });

  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME || "blogdb"}\``);
  await rootConn.end();

  await sequelize.authenticate();


  require("../models/userModel");
  require("../models/blogModel");
  require("../models/associations");

  await sequelize.sync();

  return sequelize;
}

module.exports = { sequelize, initDb };
