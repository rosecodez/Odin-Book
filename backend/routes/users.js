const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
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

// sign in as visitor to bypass the login screen, without creating an account or supplying credentials
router.post("/sign-up", userController.user_signup_post);

router.post("/log-in", userController.user_login_post);

router.get("/login/federated/google", passport.authenticate("google"));

router.post("/log-out", isAuthenticated, userController.user_logout_post);

router.post(
  "/update-profile-picture",
  upload.single("file"),
  isAuthenticated,
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

module.exports = router;
