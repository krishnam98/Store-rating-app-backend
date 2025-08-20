const router = require("express").Router();
const { allow, auth } = require("../middlewares/auth");
const storeController = require("../controllers/storeController");

router.get("/getStores", auth, allow(["user"]), storeController.getAllStores);
router.get(
  "/getStoreByOwnerId",
  auth,
  allow(["store_owner"]),
  storeController.getStorebyOwnerId
);
router.get(
  "/getRatingsByStoreId/:storeId",
  auth,
  allow(["store_owner"]),
  storeController.getRatingsbyStoreId
);

module.exports = router;
