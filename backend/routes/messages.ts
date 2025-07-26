import express, { Router } from 'express';
import messageController from '../controllers/messageController';
import isAuthenticated from '../middleware/authentication';
import upload from '../middleware/multer';

const router: Router = express.Router();

router.post(
  '/new-message',
  isAuthenticated,
  upload.single('file'),
  messageController.message_new_post
);

export default router
