const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Store = require("./store");

const Rating = sequelize.define(
  "Rating",
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  },
  { timestamps: false }
);

User.hasMany(Rating, { foreignKey: "userId" });
Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(User, { foreignKey: "userId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

Rating.addHook("afterSync", async () => {
  await sequelize
    .query(
      "ALTER TABLE Ratings ADD UNIQUE KEY uniq_user_store (userId, storeId)"
    )
    .catch(() => {});
});

module.exports = Rating;
