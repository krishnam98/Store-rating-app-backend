const router = require("express").Router();
const { allow, auth } = require("../middlewares/auth");
const passwordController = require("../controllers/passwordController");

router.post(
  "/update",
  auth,
  allow(["user", "store_owner"]),
  passwordController.updatePassword
);
module.exports = router;
