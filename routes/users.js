const express = require("express");
const router = express.Router();
const userController = require("..controllers./userController");
const upload = require("../middleware/multer");

// + sign in with authentication method
// user can keep same profile picture
router.post("/sign-up", userController.user_signup_post);

router.get("/log-in", userController.user_login_get);
router.post("/log-in", userController.user_login_post);

router.post("/log-out", userController.user_logout_post);

router.post(
  "/update-profile-picture",
  upload.single("file"),
  userController.user_update_profile_picture
);

router.get("/profile", userController.user_profile_get);
router.post("/follow", userController.user_followers_post);
router.get("/all-users", userController.user_all_get);

module.exports = router;
