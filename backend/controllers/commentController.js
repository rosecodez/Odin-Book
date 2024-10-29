const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const session = require("express-session");
const prisma = require("../prisma/prisma");

exports.comment_new_post = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session.user;

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment does not have a text" });
    }
    const { postId } = parseInt(req.params);

    const newComment = await prisma.comment.create({
      data: {
        content: text,
        userId: user.id,
        postId: postId,
      },
    });
    return res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "New comment on post failed" });
  }
});

exports.all_comments_get = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session.user;

    const { postId } = parseInt(req.params);

    const allComments = await prisma.comment.findMany({
      where: { postId: postId },
    });

    return res.status(200).json(allComments);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error while retrieving comments for post" });
  }
});
