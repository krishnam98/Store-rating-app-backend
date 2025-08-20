const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Store = require("../models/store");
const Rating = require("../models/rating");
const { Op, Model } = require("sequelize");

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      address,
      role,
    });
    res.status(201).json({ message: "userCreated", user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "owner not found" });
    }
    if (owner.role !== "store_owner") {
      return res.status(403).json({ error: "not store owner" });
    }
    const store = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.status(201).json({ message: "store created", store });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.status(200).json({ users, stores, ratings });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const where = {};
    where.id = { [Op.ne]: req.user.id };
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      where.email = { [Op.like]: `%${email}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }
    if (role) {
      where.role = role;
    }
    const Users = await User.findAll({
      attributes: ["id", "name", "email", "role", "address"],
      where,
      include: [
        {
          model: Store,
          as: "Store",
          attributes: ["id", "name", "email", "address", "avgRating"],
        },
      ],
    });

    res.status(200).json({ Users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: ["id", "name", "email", "address", "avgRating"],
    });
    return res.status(200).json({ stores });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
