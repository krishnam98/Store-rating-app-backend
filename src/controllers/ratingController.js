const sequelize = require("../config/db");
const Store = require("../models/store");
const Rating = require("../models/rating");

exports.submitRating = async (req, res) => {
  const storeId = +req.params.storeId;
  const { rating } = req.body;
  const t = await sequelize.transaction();
  try {
    const [row, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId: storeId },
      defaults: { rating },
      transaction: t,
    });
    if (!created) {
      row.rating = rating;
      await row.save({ transaction: t });
    }

    const [avgRow] = await Rating.findAll({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avg"]],
      where: { storeId: storeId },
      transaction: t,
    });

    const avg = Number(avgRow.get("avg") ?? 0).toFixed(2);

    const store = await Store.findByPk(storeId, { transaction: t });
    store.avgRating = avg;
    await store.save({ transaction: t });

    await t.commit();
    res
      .status(200)
      .json({ message: "rating submitted successfully", avgRating: avg });
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ error: error.message });
  }
};
