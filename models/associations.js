const User = require("./userModel");
const Blog = require("./blogModel");

User.hasMany(Blog, { foreignKey: "userId", onDelete: "CASCADE" });
Blog.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, Blog };
