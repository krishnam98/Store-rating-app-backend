const router = require("express").Router();
const admincontroller = require("../controllers/admincontroller");
const { auth, allow } = require("../middlewares/auth");

router.post("/addUser", auth, allow(["admin"]), admincontroller.addUser);
router.post("/addStore", auth, allow(["admin"]), admincontroller.addStore);
router.get("/getUsers", auth, allow(["admin"]), admincontroller.getAllUsers);
router.get("/getStores", auth, allow(["admin"]), admincontroller.getAllStores);
router.get("/dashboard", auth, allow(["admin"]), admincontroller.dashboard);

module.exports = router;
