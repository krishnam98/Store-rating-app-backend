const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Store = sequelize.define(
  "Store",
  {
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    address: { type: DataTypes.STRING(400) },
    avgRating: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  { timestamps: false }
);

Store.belongsTo(User, { as: "Owner", foreignKey: "ownerId" });
User.hasOne(Store, { as: "Store", foreignKey: "ownerId" });

module.exports = Store;
