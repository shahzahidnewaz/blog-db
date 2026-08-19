const { getPool } = require("../config/db");

async function createBlog({ userId, blogTitle, blog, category }) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO blogs (userId, blogTitle, blog, category) VALUES (?, ?, ?, ?)`,
    [userId, blogTitle, blog, category]
  );
  return result.insertId;
}

async function getAllBlogs() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT blogs.*, users.firstname, users.lastname
    FROM blogs JOIN users ON blogs.userId = users.id
  `);
  return rows;
}

async function getBlogsByUser(userId) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM blogs WHERE userId = ?`, [userId]);
  return rows;
}

async function findByIdOrTitle(idOrTitle) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT blogs.*, users.firstname, users.lastname
     FROM blogs JOIN users ON blogs.userId = users.id
     WHERE blogs.id = ? OR blogs.blogTitle LIKE ?`,
    [Number(idOrTitle) || 0, `%${idOrTitle}%`]
  );
  return rows;
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM blogs WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function updateBlog(id, { blogTitle, blog, category }) {
  const pool = getPool();
  await pool.query(
    `UPDATE blogs SET blogTitle = ?, blog = ?, category = ? WHERE id = ?`,
    [blogTitle, blog, category, id]
  );
}

async function deleteBlog(id) {
  const pool = getPool();
  await pool.query(`DELETE FROM blogs WHERE id = ?`, [id]);
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogsByUser,
  findByIdOrTitle,
  findById,
  updateBlog,
  deleteBlog,
};
