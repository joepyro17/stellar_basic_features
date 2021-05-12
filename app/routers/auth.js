const express = require('express');
const passport = require('passport');

const router = express.Router();

// Sign Up a Master user
router.post(
  '/signup_master',
  passport.authenticate('signup_master', { session: false }),
  async (req, res) => {
    res.send({ success: true, body: req.user });
  }
);

// Sign Up a new user
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res) => {
    res.send({ success: true, body: req.user });
  }
);
// Login
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  (req, res) => {
    res.send({
      success: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers':
          'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: { token: req.user },
    });
  }
);

module.exports = router;
