const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blogTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    blog: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "blogs",
    timestamps: true,
    createdAt: "createAt",
    updatedAt: "updateAt",
  }
);

module.exports = Blog;
