const asyncHandler = require("express-async-handler");
const session = require("express-session");
const prisma = require("../prisma/prisma");
const messageController = require("../controllers/messageController");

router.post(
  "/new-message",
  isAuthenticated,
  upload.single("file"),
  messageController.message_new_post
);
