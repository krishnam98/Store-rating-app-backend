const User = require("../models/user");

exports.getUserById = async (req, res) => {
  try {
    const userId = +req.params.userId;
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "address", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
