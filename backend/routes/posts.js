const express = require("express");
const router = express.Router();
const postController = require("../controllers/postsController");
const isAuthenticated = require("../middleware/authentication");

const upload = require("../middleware/multer");

// should always display the post content, author, comments and likes

// create new post
// will be able to upload a picture as well
router.post(
  "/new-post",
  isAuthenticated,
  upload.single("file"),
  postController.post_new_post
);

// all recent posts
router.get("/posts", isAuthenticated, postController.posts_all_get);

module.exports = router;
