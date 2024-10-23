const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const upload = require("../middleware/multer");

// should always display the post content, author, comments and likes

// create new post
router.post("/new-post", postsController.post_new_post);

// all recent posts
router.get("/posts", postsController.posts_all_get);
