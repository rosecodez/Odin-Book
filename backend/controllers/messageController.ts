const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const prisma = require("../prisma/prisma");

// message should only allow image type file
exports.message_new_post = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session.user;
    const { text } = req.body;

    if (!req.message) {
      return res.status(400).json({ error: "No message uploaded" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log(req.file);

    const newMessage = await prisma.message.create({
      data: {
        content: text,
        image: req.file ? req.file.path : null,
      },
    });
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Message error", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
