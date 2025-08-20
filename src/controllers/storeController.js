const { Op } = require("sequelize");
const Store = require("../models/store");
const Rating = require("../models/rating");
const User = require("../models/user");

exports.getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }
    const stores = await Store.findAll({
      attributes: ["id", "name", "email", "address", "avgRating"],
      where,
    });

    const storeIds = stores.map((store) => store.id);
    const myRatings = await Rating.findAll({
      where: { userId: req.user.id, storeId: storeIds },
    });

    const byStore = new Map(
      myRatings.map((rating) => [rating.storeId, rating.rating])
    );

    const result = stores.map((store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      avgRating: store.avgRating,
      myRating: byStore.get(store.id) || null,
    }));

    return res.status(200).json({ stores: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getStorebyOwnerId = async (req, res) => {
  try {
    const store = await Store.findOne({
      attributes: ["id", "name", "email", "address", "avgRating"],
      where: { ownerId: req.user.id },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    return res.status(200).json({ store });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getRatingsbyStoreId = async (req, res) => {
  try {
    const storeId = +req.params.storeId;

    const ratings = await Rating.findAll({
      where: { storeId: storeId },
      attributes: ["userId", "rating"],
      includes: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    res.status(200).json({ ratings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
