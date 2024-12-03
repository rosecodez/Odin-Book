const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/multer");
const passport = require("passport");
const isAuthenticated = require("../middleware/authentication");

// + sign in with authentication method
// initiate google OAuth
router.get("/auth/google", passport.authenticate("google"));

// google redirection after authentication
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// sign in as visitor to bypass the login screen, without creating an account or supplying credentials
router.post("/signup", userController.user_signup_post);

router.post("/login", userController.user_login_post);

router.get("/login/federated/google", passport.authenticate("google"));

router.post("/logout", isAuthenticated, userController.user_logout_post);

router.post(
  "/update-profile-picture",
  isAuthenticated,
  upload.single("file"),
  userController.user_update_profile_picture
);

router.get("/profile", isAuthenticated, userController.user_profile_get);
router.post("/follow", isAuthenticated, userController.user_followers_post);
router.get("/all-users", isAuthenticated, userController.user_get_all_contacts);
router.post(
  "/update-bio",
  isAuthenticated,
  userController.user_update_bio_post
);

router.get("/:username", userController.user_get_by_username);

module.exports = router;
