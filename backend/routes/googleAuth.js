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
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.log(err);
      return res.redirect('/login');
    }

    if (!user) {
      return res.redirect('/login');
    }

    console.log(user);

    return res.redirect('https://odin-book-frontend.onrender.com/profile');
  })
);

module.exports = router;
