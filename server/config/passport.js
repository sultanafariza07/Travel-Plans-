const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // 👇 TEMP user (later connect DB)
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        token: "test-token",
      };

      return done(null, user);
    },
  ),
);
