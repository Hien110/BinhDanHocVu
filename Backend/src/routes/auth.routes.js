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
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Lấy origin từ request hiện tại
    const currentOrigin = `${req.protocol}://${req.get("host")}`;

    // Nếu currentOrigin có trong danh sách corsOrigins thì dùng nó, không thì fallback về corsOrigins[0]
    const FRONTEND_URL = corsOrigins.includes(currentOrigin)
      ? currentOrigin
      : corsOrigins[0];

    const redirectUrl = `${FRONTEND_URL}/signin/callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify(safeUser)
    )}`;

    return res.redirect(redirectUrl);
  }
);
