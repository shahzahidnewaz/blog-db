const { ask } = require("../utils/prompt");
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");

async function allUsers() {
  const users = await userModel.getAllUsers();
  console.log("\n--- All Users ---");
  if (users.length === 0) {
    console.log("No users found.\n");
    return;
  }
  users.forEach((u) =>
    console.log(
      `#${u.id} | ${u.firstname} ${u.lastname} | ${u.email} | role: ${u.role} | active: ${!!u.isActive}`
    )
  );
  console.log("");
}

async function allUsersBlog() {
  const blogs = await blogModel.getAllBlogs();
  console.log("\n--- All Users' Blogs ---");
  if (blogs.length === 0) {
    console.log("No blogs are found\n");
    return;
  }
  blogs.forEach((b) =>
    console.log(`#${b.id} | "${b.blogTitle}" | category: ${b.category || "-"} | by: ${b.firstname} ${b.lastname}`)
  );
  console.log("");
}

async function updateUser() {
  const id = await ask("Enter user ID to update: ");
  const user = await userModel.findById(id);
  if (!user) {
    console.log("User not found.\n");
    return;
  }
  const input = await ask(`Set isActive for ${user.firstname} ${user.lastname} (true/false): `);
  const isActive = input.toLowerCase() === "true";
  await userModel.updateIsActive(id, isActive);
  console.log(`User isActive updated to ${isActive}.\n`);
}

async function deleteUser() {
  const id = await ask("Enter user ID to delete: ");
  const user = await userModel.findById(id);
  if (!user) {
    console.log("User not found.\n");
    return;
  }
  await userModel.deleteUser(id);
  console.log("User deleted successfully (their blogs were removed too).\n");
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

module.exports = { allUsers, allUsersBlog, updateUser, deleteUser, searchBlog };
