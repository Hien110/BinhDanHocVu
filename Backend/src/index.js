// server.js — phiên bản đã viết lại (CORS chắc kèo)
// ----------------------------------------------
// Ghi chú:
// - Đọc ENV từ Azure/.env và parse cẩn thận (loại dấu nháy, xuống dòng).
// - CORS linh hoạt: hỗ trợ whitelist + pattern *.binhdanso.com, preflight OPTIONS, allowed headers/methods.
// - Thêm Vary: Origin để tránh cache sai khi qua CDN/proxy.
// - Đặt trust proxy để cookie secure hoạt động đúng sau proxy (Azure/App Service/Ingress).

const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");

const route = require("./routes");
const db = require("./config/db");
const sessionMiddleware = require("./config/session/session");

// 1) Load biến môi trường càng sớm càng tốt
dotenv.config();

// 2) Kết nối Database
//    (nếu connect có async/await, có thể cần chờ trước khi listen)
db.connect();

// 3) Tạo app
const app = express();

// 4) Tin tưởng proxy phía trước (Azure/NGINX/Ingress) để xác định scheme đúng
app.set("trust proxy", 1);

/* ==============================
   🔹 Cấu hình CORS từ ENV (chắc kèo)
============================== */
const raw = process.env.CORS_ORIGINS || "";

// Chuẩn hóa: bỏ nháy đầu/cuối nếu lỡ bọc, tách theo dấu phẩy/space/newline
const allowedOrigins = raw
  .replace(/^\s*['"]|['"]\s*$/g, "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

const allowSet = new Set(allowedOrigins);

function isAllowed(origin) {
  if (!origin) return true; // Cho Postman/mobile app/Server-to-server
  if (allowSet.has(origin)) return true;
  // Cho phép thêm mọi subdomain HTTPS của binhdanso.com (tùy chọn)
  try {
    const u = new URL(origin);
    if (
      u.protocol === "https:" &&
      (u.hostname === "binhdanso.com" || u.hostname.endsWith(".binhdanso.com"))
    ) {
      return true;
    }
  } catch (_) {
    // origin không phải URL hợp lệ -> không cho
  }
  return false;
}

const corsOptions = {
  origin(origin, callback) {
    const ok = isAllowed(origin);
    if (ok) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

// Áp dụng CORS cho tất cả request
app.use(cors(corsOptions));
// Bảo đảm preflight OPTIONS luôn có header CORS hợp lệ
app.options(/.*/, cors(corsOptions)); // Express 5 + path-to-regexp v6: dùng RegExp thay vì "*"

// Thêm Vary: Origin để CDN/proxy không cache sai theo Origin
app.use((req, res, next) => {
  res.append("Vary", "Origin");
  next();
});

/* ==============================
   🔹 Middleware cơ bản
============================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("combined"));

// Session (nếu dùng cookie cross-site, nhớ cấu hình SameSite=None; Secure trong sessionMiddleware)
app.use(sessionMiddleware);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Passport
require("./config/passport/passport-config");
app.use(passport.initialize());
app.use(passport.session());

/* ==============================
   🔹 Healthcheck đơn giản
============================== */
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

/* ==============================
   🔹 Khởi tạo routes chính
============================== */
route(app);

/* ==============================
   🔹 Error handler — đặc biệt cho CORS
============================== */
// Nếu lỗi CORS (do callback(new Error())) → trả 403 kèm message rõ ràng
app.use((err, req, res, next) => {
  if (err && typeof err.message === "string" && err.message.startsWith("CORS blocked:")) {
    return res.status(403).json({ error: err.message });
  }
  return next(err);
});

// Fallback error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ==============================
   🔹 Start server
============================== */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);
});
