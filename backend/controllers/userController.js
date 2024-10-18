const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const session = require("express-session");
const prisma = require("../prisma/prisma");

exports.user_signup_post = [
  body("username", "Username must be specified and valid").trim().escape(),
  body("password", "Password must be specified and at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        errors: errors.array(),
        user: req.body,
      });
    }
    try {
      const existingUser = await prisma.user.findUnique({
        where: { username: req.body.username },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
        },
      });

      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        res.status(200).json({
          message: "Signup successful",
          user: { id: user.id, username: user.username },
        });
      });
    } catch (err) {
      console.error("Signup error details:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
  }),
];

exports.user_login_post = [
  asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      req.session.user = { id: user.id, username: user.username };
      console.log("Session after login:", req.session);
      return res
        .status(200)
        .json({ message: "Login successful", user: req.session.user });
    } catch (error) {
      next(error);
    }
  }),
];

exports.user_logout_post = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

exports.user_update_profile_picture = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session.user;
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, please log in." });
    }

    console.log("Request file object:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = user.id;

    // new cloudinary picture link
    const newProfileImage = req.file.path;
    console.log(newProfileImage);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profile: newProfileImage },
    });

    return res.status(200).json({
      message: "Image uploaded successfully!",
      profileImage: updatedUser.profile,
    });
  } catch (err) {
    console.error("Error updating profile picture", err);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});
