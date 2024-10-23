const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// create new comment
router.post("/:postId/new-comment", commentsController.comment_new_post);

// all comments of a post
router.get("/:postId/comments", commentsController.all_comments_get);
