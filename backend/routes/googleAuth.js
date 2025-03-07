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

  passport.authenticate('google', (err, user) => {
    console.log('google auth middleware working');

    if (err) {
      console.log(err);
    }

    if (!user) {
      console.log('user not authenticated');
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.redirect('/login');
      }

      console.log('user session saved');
      return res.redirect('https://odin-book-frontend.onrender.com/profile');
    });
  })
);

module.exports = router;
