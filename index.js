const { initDb } = require("./config/db");
const { ask, closePrompt } = require("./utils/prompt");
const authController = require("./controllers/authController");
const blogController = require("./controllers/blogController");
const adminController = require("./controllers/adminController");

async function userMenu(user) {
  let loggedIn = true;
  while (loggedIn) {
    console.log(`--- User Menu (${user.firstname}) ---`);
    console.log("1. View Your Blogs");
    console.log("2. Search Blog by ID/Title");
    console.log("3. Create Blog");
    console.log("4. Update Blog");
    console.log("5. Delete Blog");
    console.log("6. Logout");
    const choice = await ask("Select an option: ");

    switch (choice) {
      case "1":
        await blogController.viewYourBlogs(user);
        break;
      case "2":
        await blogController.searchBlog();
        break;
      case "3":
        await blogController.createBlog(user);
        break;
      case "4":
        await blogController.updateBlog(user, false);
        break;
      case "5":
        await blogController.deleteBlog(user, false);
        break;
      case "6":
        loggedIn = false;
        console.log("Logged out.\n");
        break;
      default:
        console.log("Invalid option.\n");
    }
  }
}

async function adminMenu(admin) {
  let loggedIn = true;
  while (loggedIn) {
    console.log(`--- Admin Menu (${admin.firstname}) ---`);
    console.log("1. View All Users");
    console.log("2. View All Blogs");
    console.log("3. Search Blog by ID/Title");
    console.log("4. Update User");
    console.log("5. Delete User");
    console.log("6. Delete Blog");
    console.log("7. Logout");
    const choice = await ask("Select an option: ");

    switch (choice) {
      case "1":
        await adminController.allUsers();
        break;
      case "2":
        await adminController.allUsersBlog();
        break;
      case "3":
        await adminController.searchBlog();
        break;
      case "4":
        await adminController.updateUser();
        break;
      case "5":
        await adminController.deleteUser();
        break;
      case "6":
        await blogController.deleteBlog(admin, true);
        break;
      case "7":
        loggedIn = false;
        console.log("Logged out.\n");
        break;
      default:
        console.log("Invalid option.\n");
    }
  }
}

async function mainMenu() {
  let running = true;
  while (running) {
    console.log("=== BlogDB ===");
    console.log("              ");
    console.log("1. View All Blogs");
    console.log("2. Login");
    console.log("3. Register");
    console.log("4. Exit");
    const choice = await ask("Select an option: ");

    switch (choice) {
      case "1":
        await blogController.allBlog();
        break;
      case "2": {
        const user = await authController.login();
        if (user) {
          if (user.role === "admin") {
            await adminMenu(user);
          } else {
            await userMenu(user);
          }
        }
        break;
      }
      case "3":
        await authController.register();
        break;
      case "4":
        running = false;
        console.log("Goodbye!");
        break;
      default:
        console.log("Invalid option.\n");
    }
  }
}

async function start() {
  try {
    await initDb();
    console.log("Connected to MySQL and ready.\n");
    await mainMenu();
  } catch (err) {
    console.error("Failed to start app:", err.message);
  } finally {
    closePrompt();
    process.exit(0);
  }
}

start();