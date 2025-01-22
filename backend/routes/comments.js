const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const isAuthenticated = require('../middleware/authentication');
const multer = require('multer');
const upload = multer();

// GET Routes
router.get(
  '/:postId/comments',
  isAuthenticated,
  commentController.all_comments_get
);

// POST Routes
router.post(
  '/:postId/new-comment',
  upload.none(),
  isAuthenticated,
  commentController.comment_new_post
);

module.exports = router;
