const express = require("express");
const router = express();
const userControllers = require("../Controllers/UserControllers");
const authControllers = require("../Controllers/authControllers");

router.post("/signin", authControllers.signup);
router.post("/login", authControllers.login);
router.post("/token", authControllers.accessTokenRefresh);

router.use(authControllers.protect);
router.get("/getMe", authControllers.getMe);
router
  .route("/:id")
  .get(authControllers.restrictTo("admin"), userControllers.getUser)
  .put(userControllers.updateUser)
  .delete(authControllers.restrictTo("admin"), userControllers.deleteUser);
router
  .route("/")
  .get(authControllers.restrictTo("admin"), userControllers.getAllUser);

module.exports = router;
