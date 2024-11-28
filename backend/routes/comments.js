const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const isAuthenticated = require("../middleware/authentication");

// create new comment
router.post(
  "/:postId/new-comment",
  isAuthenticated,
  commentController.comment_new_post
);

// all comments of a post
router.get(
  "/:postId/comments",
  isAuthenticated,
  commentController.all_comments_get
);

module.exports = router;
