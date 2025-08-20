const express = require("express");
const { signUp, login, verify } = require("../controllers/authController");
const { auth, allow } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/verify", auth, allow(["user", "store_owner", "admin"]), verify);

module.exports = router;
