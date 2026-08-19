const { getPool } = require("../config/db");

async function createUser({ firstname, lastname, email, password }) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)`,
    [firstname, lastname, email, password]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0] || null;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function getAllUsers() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, firstname, lastname, email, isActive, role, createAt, updateAt FROM users`
  );
  return rows;
}

async function updateIsActive(id, isActive) {
  const pool = getPool();
  await pool.query(`UPDATE users SET isActive = ? WHERE id = ?`, [isActive, id]);
}

async function deleteUser(id) {
  const pool = getPool();
  await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  updateIsActive,
  deleteUser,
};
