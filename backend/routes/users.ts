import express, { Router } from 'express';
import userController from '../controllers/userController';
import upload from '../middleware/multer';
import isAuthenticated from '../middleware/authentication';

const router: Router = express.Router();
// GET Routes

router.get('/profile', isAuthenticated, userController.user_profile_get);
router.get('/all-users', isAuthenticated, userController.user_get_all_contacts);
router.get('/:username', userController.user_get_by_username);

// POST Routes
router.post('/signup', userController.user_signup_post);
router.post('/login', userController.user_login_post);
router.post('/logout', isAuthenticated, userController.user_logout_post);
router.post(
  '/update-bio',
  isAuthenticated,
  userController.user_update_bio_post
);
router.post('/:username/follow', isAuthenticated, userController.user_follow);

// PUT Routes
router.put(
  '/update-profile-picture',
  isAuthenticated,
  upload.single('file'),
  userController.user_update_profile_picture
);

export default router
