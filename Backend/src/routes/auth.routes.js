const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(o => o.trim())
  : (() => { throw new Error("❌ Thiếu biến môi trường CORS_ORIGINS"); })();

// 🟢 Bạn có thể chọn origin đầu tiên trong danh sách làm FRONTEND redirect
const FRONTEND_URL = corsOrigins[0];

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const { password, otp, otpExpires, ...safeUser } = user._doc || user;

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Redirect về FE đầu tiên trong danh sách CORS_ORIGINS
    const redirectUrl = `${FRONTEND_URL}/signin/callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify(safeUser)
    )}`;

    return res.redirect(redirectUrl);
  }
);

module.exports = router;
