const express = require("express");
const router = express.Router();
const userController = require("..controllers./userController");

router.post("/sign-up", userController.user_signup_post);

router.get("/log-in", userController.user_login_get);
router.post("/log-in", userController.user_login_post);

router.post("/log-out", userController.user_logout_post);

module.exports = router;
