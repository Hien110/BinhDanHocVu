// routes/auth.google.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

/** Parse danh sách origin FE từ ENV (khớp với CORS_ORIGINS) */
const raw = process.env.CORS_ORIGINS || "";
const allowedOrigins = raw
  .replace(/^\s*['"]|['"]\s*$/g, "") // bỏ nháy lỡ dán
  .split(/[,\s]+/)
  .map((s) => s.trim())
  .filter(Boolean);
const allowSet = new Set(allowedOrigins);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    // chỉ chấp nhận đúng những origin có trong whitelist (khớp scheme + host + port)
    return allowSet.has(`${u.protocol}//${u.host}`);
  } catch {
    return false;
  }
}

/** Lấy origin FE đã khởi tạo flow:
 *  - Ưu tiên header Origin của browser
 *  - Fallback: req.query.origin (nếu gọi server-to-server)
 */
function resolveRequestOrigin(req) {
  const hOrigin = req.headers.origin;
  if (isAllowedOrigin(hOrigin)) return hOrigin;

  const qOrigin = req.query.origin;
  if (isAllowedOrigin(qOrigin)) return qOrigin;

  return null;
}

/** Tạo state token (JWT) để mang returnUrl an toàn */
function signState(payload) {
  return jwt.sign(payload, process.env.OAUTH_STATE_SECRET, { expiresIn: "10m" });
}
function verifyState(token) {
  try {
    return jwt.verify(token, process.env.OAUTH_STATE_SECRET);
  } catch {
    return null;
  }
}

/** BẮT ĐẦU XÁC THỰC
 *  - Gọi /auth/google từ FE (Origin sẽ tự gửi).
 *  - Ta đọc Origin, tạo returnUrl = `${origin}/signin/callback` (hoặc nhận returnUrl cụ thể qua query nếu muốn).
 *  - Nhét returnUrl vào `state` (JWT) để callback dùng lại.
 */
router.get("/google", (req, res, next) => {
  // Cho phép client tùy chọn path callback: /signin/callback (mặc định)
  // Nếu có ?returnPath=/foo/bar thì sẽ callback về `${origin}/foo/bar`
  const origin = resolveRequestOrigin(req);
  if (!origin) {
    return res.status(400).json({ error: "Invalid or missing Origin for OAuth start." });
  }

  const returnPath = typeof req.query.returnPath === "string" && req.query.returnPath.startsWith("/")
    ? req.query.returnPath
    : "/signin/callback";

  const returnUrl = `${origin}${returnPath}`;

  const state = signState({ returnUrl });

  // chuyển sang passport với scope + state
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
    session: false, // ta không dùng session của Passport
  })(req, res, next);
});

/** CALLBACK TỪ GOOGLE
 *  - Xác thực passport
 *  - Lấy `state` từ query -> verify -> lấy returnUrl
 *  - Tạo token cho FE và redirect về returnUrl
 */
router.get(
  "/google/callback",
  // Nếu cần, trong cấu hình Strategy nhớ để callbackURL trỏ vào endpoint này
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Lấy returnUrl từ state
    const stateRaw = req.query.state;
    const state = verifyState(stateRaw);

    // Nếu state hỏng, fallback về origin đầu tiên trong whitelist
    const fallbackOrigin = allowedOrigins[0] || "";
    const baseReturnUrl = state && typeof state.returnUrl === "string" && isAllowedOrigin(new URL(state.returnUrl).origin)
      ? state.returnUrl
      : (fallbackOrigin ? `${fallbackOrigin}/signin/callback` : null);

    if (!baseReturnUrl) {
      return res.status(400).json({ error: "Cannot resolve a safe return URL." });
    }

    // Chuẩn hóa user an toàn
    const user = req.user || {};
    const doc = user._doc || user; // hỗ trợ Mongoose
    const { password, otp, otpExpires, ...safeUser } = doc;

    // Phát hành access token cho FE
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Redirect về FE đúng origin đã khởi tạo flow
    const redirectUrl =
      `${baseReturnUrl}` +
      `?token=${encodeURIComponent(token)}` +
      `&user=${encodeURIComponent(JSON.stringify(safeUser))}`;

    return res.redirect(redirectUrl);
  }
);

module.exports = router;
