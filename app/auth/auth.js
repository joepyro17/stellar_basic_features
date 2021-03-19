const passport = require('passport');
const Console = require('Console');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const StellarSDK = require('stellar-sdk');
const FriendBot = require('../services/FriendBotService');
const AssetsService = require('../services/AssetsService');
const User = require('../models/User');
require('dotenv').config();

// Sign Up Master
passport.use(
  'signup_master',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      Console.debug(`( Passport @ signup ) Signup Master from ${email}`);

      const user = new User();
      user.name = req.body.name;
      user.age = Number(req.body.age);
      user.email = email;
      user.password = password;
      try {
        // create a new keypair public and secret key
        const pair = StellarSDK.Keypair.random();
        console.debug('Keypair was generated');
        console.debug(`Public Key: ${pair.publicKey()}`);
        console.debug(`Secret Key: ${pair.secret()}`);
        user.public_key = pair.publicKey();
        user.secret_key = pair.secret();
        // Funding some lumen
        await FriendBot.fundingLumen(pair.publicKey()).then((r) => {
          console.log(r);
        });
        // Save to DB
        const newUser = await user.save();

        Console.success('New Master user was created successfully');
        return done(null, newUser);
      } catch (err) {
        Console.error(err);
        return done(err);
      }
    }
  )
);

// Sign Up
passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      Console.debug(`( Passport @ signup ) Signup from ${email}`);

      const user = new User();
      user.name = req.body.name;
      user.age = Number(req.body.age);
      user.email = email;
      user.password = password;
      try {
        // create a new keypair public and secret key
        const pair = StellarSDK.Keypair.random();
        console.debug('Keypair was generated');
        console.debug(`Public Key: ${pair.publicKey()}`);
        console.debug(`Secret Key: ${pair.secret()}`);
        user.public_key = pair.publicKey();
        user.secret_key = pair.secret();
        // Funding some lumen
        await FriendBot.fundingLumen(pair.publicKey()).then((r) => {
          console.log(r);
        });
        // Give the new user some Token
        await AssetsService.createAssetAfterSignUp(pair.secret());
        // Save to DB
        const newUser = await user.save();

        Console.success('New user was created successfully');
        return done(null, newUser);
      } catch (err) {
        Console.error(err);
        return done(err);
      }
    }
  )
);

// Login
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        Console.debug(`( Passport @ Login ) Login from ${email}`);

        const user = await User.findOne({ email });

        if (!user) return done(null, false, { message: 'User not found' });

        const validate = await user.comparePassword(password);

        if (!validate) return done(null, false, { message: 'Wrong Password' });

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_TOP_SECRET);

        Console.success('Logged in Successfully');
        return done(null, token, { message: 'Logged in Successfully' });
      } catch (err) {
        Console.error(err);
        return done(err);
      }
    }
  )
);

// JWT
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_TOP_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
