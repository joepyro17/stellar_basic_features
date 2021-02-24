const express = require('express');
const passport = require('passport');

const router = express.Router();

// Sign Up a new user
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);
// Login
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  (req, res) => {
    res.send({ success: true, body: { token: req.user } });
  }
);

module.exports = router;
