const { Op } = require("sequelize");
const { ask } = require("../utils/prompt");
const { Blog, User } = require("../models/associations");

function printBlogRow(b) {
  const author = b.User ? `${b.User.firstname} ${b.User.lastname}` : `userId ${b.userId}`;
  console.log(`#${b.id} | "${b.blogTitle}" | category: ${b.category || "-"} | by: ${author}`);
}

async function allBlog() {
  const blogs = await Blog.findAll({ include: User });
  console.log("\n--- All Blogs ---");
  if (blogs.length === 0) {
    console.log("No blogs are found\n");
    return;
  }
  blogs.forEach(printBlogRow);
  console.log("");
}

async function viewYourBlogs(user) {
  const blogs = await Blog.findAll({ where: { userId: user.id } });
  console.log(`\n--- Your Blogs ---`);
  if (blogs.length === 0) {
    console.log("No blogs are found\n");
    return;
  }
  blogs.forEach((b) => console.log(`#${b.id} | "${b.blogTitle}" | category: ${b.category || "-"}`));
  console.log("");
}

async function searchBlog() {
  const term = await ask("Enter blog ID or title to search: ");
  const results = await Blog.findAll({
    where: {
      [Op.or]: [{ id: Number(term) || 0 }, { blogTitle: { [Op.like]: `%${term}%` } }],
    },
    include: User,
  });
  console.log("\n--- Search Results ---");
  if (results.length === 0) {
    console.log("No blogs are found\n");
    return;
  }
  results.forEach((b) => {
    console.log(`#${b.id} | "${b.blogTitle}" | category: ${b.category || "-"} | by: ${b.User.firstname} ${b.User.lastname}`);
    console.log(`   ${b.blog}\n`);
  });
}

async function createBlog(user) {
  console.log("\n--- Create Blog ---");
  const blogTitle = await ask("Blog title: ");
  const blog = await ask("Blog content: ");
  const category = await ask("Category: ");

  const created = await Blog.create({ userId: user.id, blogTitle, blog, category });
  console.log(`Blog created successfully with ID ${created.id}.\n`);
}

async function updateBlog(user, isAdmin = false) {
  const id = await ask("Enter blog ID to update: ");
  const existing = await Blog.findByPk(id);

  if (!existing) {
    console.log("Blog not found.\n");
    return;
  }
  if (!isAdmin && existing.userId !== user.id) {
    console.log("You can only update your own blogs.\n");
    return;
  }

  const blogTitle = (await ask(`New title (current: "${existing.blogTitle}"): `)) || existing.blogTitle;
  const blog = (await ask(`New content (current: "${existing.blog}"): `)) || existing.blog;
  const category = (await ask(`New category (current: "${existing.category || "-"}"): `)) || existing.category;

  await existing.update({ blogTitle, blog, category });
  console.log("Blog updated successfully.\n");
}

async function deleteBlog(user, isAdmin = false) {
  const id = await ask("Enter blog ID to delete: ");
  const existing = await Blog.findByPk(id);

  if (!existing) {
    console.log("Blog not found.\n");
    return;
  }
  if (!isAdmin && existing.userId !== user.id) {
    console.log("You can only delete your own blogs.\n");
    return;
  }

  await existing.destroy();
  console.log("Blog deleted successfully.\n");
}

module.exports = {
  allBlog,
  viewYourBlogs,
  searchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
