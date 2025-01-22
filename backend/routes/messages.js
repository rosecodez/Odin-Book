const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const isAuthenticated = require('../middleware/authentication');
const upload = require('../middleware/multer');

router.post(
  '/new-message',
  isAuthenticated,
  upload.single('file'),
  messageController.message_new_post
);

module.exports = router;
