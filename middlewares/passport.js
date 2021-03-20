const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-token").Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const User = require("../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      User.findOrCreate({ email, passport }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.comparePassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  new FacebookTokenStrategy(
    {
      fbGraphVersion: "v3.0",
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOrCreate(
        {
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // avatarUrl: profile.photos[0].value,
        },
        (error, user) => {
          return done(error, user);
        }
      );
    }
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
    (token, tokenSecret, profile, done) => {
      User.findOrCreate(
        {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // avatarUrl: profile._json.picture,
        },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);
