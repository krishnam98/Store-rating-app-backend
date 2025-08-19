const router = require("express").Router();
const { allow, auth } = require("../middlewares/auth");
const storeController = require("../controllers/storeController");

router.get("/getStores", auth, allow(["user"]), storeController.getAllStores);

module.exports = router;
