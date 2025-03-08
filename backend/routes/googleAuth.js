const express = require('express');
const passport = require('passport');
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
  (req, res, next) => {
    next();
  },

  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('google auth callback route Hit');
    return res.redirect('https://odin-book-frontend.onrender.com/profile');
  }
);

module.exports = router;
