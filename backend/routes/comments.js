const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentsController");

// create new comment
router.post("/:postId/new-comment", commentController.comment_new_post);

// all comments of a post
router.get("/:postId/comments", commentController.all_comments_get);
