const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const prisma = require("../prisma/prisma");

exports.post_new_post = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Missing text" });
    }

    console.log(req.file);

    const newPost = await prisma.post.create({
      data: {
        content: text,
        userId: user.id,
        post_image: req.file ? req.file.path : null,
      },
      include: {
        user: true,
      },
    });

    console.log(newPost);

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating new post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating a new post." });
  }
});

exports.posts_all_get = asyncHandler(async (req, res, next) => {
  const user = req.user;
  console.log(user);
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          not: user.id,
        },
      },
      include: {
        user: true,
      },
    });
    return res.status(201).json(posts);
  } catch (error) {
    console.error("An error occurred while fetching posts", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts" });
  }
});

exports.posts_user_all_get = asyncHandler(async (req, res, next) => {
  const user = req.user;
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
    return res.status(201).json(posts);
  } catch (error) {
    console.error("An error occurred while fetching posts", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts" });
  }
});
