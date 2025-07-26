import express, { Router } from 'express';
import commentController from '../controllers/commentController';
import isAuthenticated from '../middleware/authentication';
import multer from 'multer';

const upload = multer();
const router: Router = express.Router();

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

export default router;