const passport = require("passport");
const { consts } = require("./config");
const { db } = require("../models");
const userService = require("../services/user.service");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CALL_BACK_URL = `${consts.base_url}/oauth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: consts.oauth_google_client_id,
      clientSecret: consts.oauth_google_client_secret,
      callbackURL: GOOGLE_CALL_BACK_URL,
    },
    async(accessToken, refreshToken, profile, done) => {
      const user = {
        name : profile["_json"].name,
        email :  profile["_json"].email,
        password : "NA",
        role : "user",
        auth_type : "oauth-google"
      }
      
      await userService.createUser(user);
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;