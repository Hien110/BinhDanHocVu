// File: config/passport/passport-config.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../app/models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          if (existingUser.avatar === "") {
            existingUser.avatar = profile.photos[0].value; // Cập nhật avatar nếu chưa có
            await existingUser.save();
          }
          return done(null, existingUser); // Không tạo mới nếu đã có
        }

        const newUser = new User({
          email: profile.emails[0].value,
          fullName: profile.displayName,
          avatar: profile.photos[0].value,
          role: "student",
          status: "active", 
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});