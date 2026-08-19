const bcrypt = require("bcryptjs");
const { ask } = require("../utils/prompt");
const userModel = require("../models/userModel");

async function register() {
  console.log("\n--- Register ---");
  const firstname = await ask("First name: ");
  const lastname = await ask("Last name: ");
  const email = await ask("Email: ");

  const existing = await userModel.findByEmail(email);
  if (existing) {
    console.log("An account with this email already exists.\n");
    return null;
  }

  const password = await ask("Password: ");
  const hashed = await bcrypt.hash(password, 10);

  const id = await userModel.createUser({ firstname, lastname, email, password: hashed });
  console.log(`Registration successful! Your user ID is ${id}. Please log in.\n`);
  return id;
}

async function login() {
  console.log("\n--- Login ---");
  const email = await ask("Email: ");
  const password = await ask("Password: ");

  const user = await userModel.findByEmail(email);
  if (!user) {
    console.log("No account found with that email.\n");
    return null;
  }

  if (!user.isActive) {
    console.log("User is deactivated\n");
    return null;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log("Incorrect password.\n");
    return null;
  }

  console.log(`Welcome back, ${user.firstname}!\n`);
  return user;
}

module.exports = { register, login };
