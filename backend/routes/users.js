const express = require("express");
const router = express.Router();
const userController = require("..controllers./userController.js");
const upload = require("../middleware/multer");

// + sign in with authentication method
// initiate google OAuth
router.get("/auth/google", passport.authenticate("google"));

// google redirection after authentication
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/log-in" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/login/federated/google", passport.authenticate("google"));

// user can keep same profile picture
router.post("/sign-up", userController.user_signup_post);

router.post("/log-in", userController.user_login_post);

router.post("/log-out", userController.user_logout_post);

router.post(
  "/update-profile-picture",
  upload.single("file"),
  userController.user_update_profile_picture
);

router.get("/profile", userController.user_profile_get);
router.post("/follow", userController.user_followers_post);
router.get("/all-users", userController.user_get_all_contacts);

module.exports = router;
