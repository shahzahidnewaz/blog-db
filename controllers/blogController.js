const { ask } = require("../utils/prompt");
const blogModel = require("../models/blogModel");

function printBlogRow(b) {
  console.log(
    `#${b.id} | "${b.blogTitle}" | category: ${b.category || "-"} | by: ${
      b.firstname ? `${b.firstname} ${b.lastname}` : `userId ${b.userId}`
    }`
  );
}

async function allBlog() {
  const blogs = await blogModel.getAllBlogs();
  console.log("\n--- All Blogs ---");
  if (blogs.length === 0) {
    console.log("No blogs are found\n");
    return;
  }
  blogs.forEach(printBlogRow);
  console.log("");
}

async function viewYourBlogs(user) {
  const blogs = await blogModel.getBlogsByUser(user.id);
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
  const results = await blogModel.findByIdOrTitle(term);
  console.log("\n--- Search Results ---");
  if (results.length === 0) {
    console.log("No blogs are found\n");
    return;
  }
  results.forEach((b) => {
    console.log(`#${b.id} | "${b.blogTitle}" | category: ${b.category || "-"} | by: ${b.firstname} ${b.lastname}`);
    console.log(`   ${b.blog}\n`);
  });
}

async function createBlog(user) {
  console.log("\n--- Create Blog ---");
  const blogTitle = await ask("Blog title: ");
  const blog = await ask("Blog content: ");
  const category = await ask("Category: ");

  const id = await blogModel.createBlog({ userId: user.id, blogTitle, blog, category });
  console.log(`Blog created successfully with ID ${id}.\n`);
}

async function updateBlog(user, isAdmin = false) {
  const id = await ask("Enter blog ID to update: ");
  const existing = await blogModel.findById(id);

  if (!existing) {
    console.log("Blog not found.\n");
    return;
  }
  if (!isAdmin && existing.userId !== user.id) {
    console.log("You can only update your own blogs.\n");
    return;
  }

  const blogTitle = await ask(`New title (current: "${existing.blogTitle}"): `) || existing.blogTitle;
  const blog = await ask(`New content (current: "${existing.blog}"): `) || existing.blog;
  const category = await ask(`New category (current: "${existing.category || "-"}"): `) || existing.category;

  await blogModel.updateBlog(id, { blogTitle, blog, category });
  console.log("Blog updated successfully.\n");
}

async function deleteBlog(user, isAdmin = false) {
  const id = await ask("Enter blog ID to delete: ");
  const existing = await blogModel.findById(id);

  if (!existing) {
    console.log("Blog not found.\n");
    return;
  }
  if (!isAdmin && existing.userId !== user.id) {
    console.log("You can only delete your own blogs.\n");
    return;
  }

  await blogModel.deleteBlog(id);
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
