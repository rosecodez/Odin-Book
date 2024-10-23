const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const session = require("express-session");
const prisma = require("../prisma/prisma");

exports.post_new_post = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, please log in." });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Missing text" });
    }

    const newPost = await prisma.post.create({
      data: {
        content: text,
        userId: user.id,
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating new post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating a new post." });
  }
});

exports.posts_all_get = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, please log in." });
    }

    const newPost = await prisma.post.create({
      data: {
        content: text,
        userId: user.id,
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating new post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating a new post." });
  }
});
