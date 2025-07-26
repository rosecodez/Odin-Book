import express, { Router } from 'express';
import postController from '../controllers/postsController';
import isAuthenticated from '../middleware/authentication';
import upload from '../middleware/multer';

const router: Router = express.Router();

// GET Routes
router.get('/all-posts', isAuthenticated, postController.posts_all_get);
router.get('/all-posts-visitor', postController.posts_all_get_visitor);
router.get(
  '/profile-all-posts',
  isAuthenticated,
  postController.posts_user_all_get
);
router.get('/users/:userId', isAuthenticated, postController.posts_user_by_id);
router.get('/:postId', postController.get_post_by_id);

// POST Routes
router.post(
  '/new-post',
  isAuthenticated,
  upload.single('image'),
  postController.post_new_post
);

router.post('/:postId/like', isAuthenticated, postController.like_post);

// PUT Routes
router.put('/:postId/update', isAuthenticated, postController.update_post);

// DELETE Routes
router.delete('/:postId/delete', isAuthenticated, postController.delete_post);
router.delete('/:postId/unlike', isAuthenticated, postController.unlike_post);

export default router
