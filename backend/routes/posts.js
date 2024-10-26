const express = require("express");
const router = express.Router();
const postController = require("../controllers/postsController");
const upload = require("../middleware/multer");

// should always display the post content, author, comments and likes

// create new post
// will be able to upload a picture as well
router.post("/new-post", upload.single("file"), postController.post_new_post);

// all recent posts
router.get("/posts", postController.posts_all_get);
