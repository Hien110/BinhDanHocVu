// server.js
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");

const route = require("./routes");
const db = require("./config/db");
const sessionMiddleware = require("./config/session/session");

// Load biến môi trường từ .env
dotenv.config();

// Kết nối Database
db.connect();

const app = express();

/* ==============================
   🔹 Cấu hình CORS từ ENV
============================== */
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Cho phép Postman, mobile app
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin} not allowed`));
    },
    credentials: true,
  })
);

/* ==============================
   🔹 Middleware cơ bản
============================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("combined"));

// Session
app.use(sessionMiddleware);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Passport
require("./config/passport/passport-config");
app.use(passport.initialize());
app.use(passport.session());

// Khởi tạo routes
route(app);

/* ==============================
   🔹 Start server
============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
