const express = require('express');
const passport = require('passport');
const router = express.Router();

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
    console.log('google auth route works');
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: 'https://odin-book-frontend.onrender.com/profile',
  })
);

module.exports = router;
