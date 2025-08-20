const router = require("express").Router();
const { allow, auth } = require("../middlewares/auth");
const ratingController = require("../controllers/ratingController");

router.post("/:storeId", auth, allow(["user"]), ratingController.submitRating);

module.exports = router;
