import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = express.Router();

console.log('google auth works in express');

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/auth/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },
  
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    console.log('google auth callback route hit');
    return res.redirect('https://odin-book-frontend.onrender.com/profile');
  }
);
export default router

