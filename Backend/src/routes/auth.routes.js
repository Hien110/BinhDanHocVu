const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");
const FRONTEND_URL = "https://www.binhdanso.com/"; // frontend URL của bạn
// Bắt đầu xác thực với Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google gọi lại URL này sau khi xác thực xong
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const { password, otp, otpExpires, ...safeUser } = user._doc || user;

    // Tạo token chứa userId và role
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Redirect về frontend kèm token & user info đã lọc
    const redirectUrl = `${FRONTEND_URL}/signin/callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify(safeUser)
    )}`;

    return res.redirect(redirectUrl);
  }
);

module.exports = router;