const router = require("express").Router();
const { allow, auth } = require("../middlewares/auth");
const userController = require("../controllers/userController");

router.get(
  "/getUserByID/:userId",
  auth,
  allow(["user", "store_owner", "admin"]),
  userController.getUserById
);

module.exports = router;
