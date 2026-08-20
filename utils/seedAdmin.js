const { initDb } = require("../config/db");
const { ask, closePrompt } = require("./prompt");
const { User } = require("../models/associations");

async function run() {
  await initDb();
  const email = await ask("Email of the user to promote to admin: ");
  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log("No user found with that email. Register them in the app first.");
  } else {
    await user.update({ role: "admin" });
    console.log(`${user.firstname} ${user.lastname} is now an admin.`);
  }
  closePrompt();
  process.exit(0);
}
run();