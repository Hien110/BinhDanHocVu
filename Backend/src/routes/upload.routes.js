// src/routes/cloudinary.route.js
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

/**
 * Ký upload cho client upload trực tiếp lên Cloudinary.
 * - Với ảnh: client gọi Cloudinary upload endpoint với resource_type: "image"
 * - Với Word/tài liệu: dùng resource_type: "raw"
 *
 * Gợi ý client:
 *  - url: https://api.cloudinary.com/v1_1/<cloudName>/<resource_type>/upload
 *  - body (form-data): file, api_key, timestamp, signature, folder, [public_id?]
 */
router.get("/cloudinary-signature", (req, res) => {
  const folder = (req.query.folder || "courses").toString();
  const publicId = req.query.publicId ? req.query.publicId.toString() : undefined;

  const timestamp = Math.floor(Date.now() / 1000);

  // Tham số dùng để ký — chỉ ký những gì client cũng sẽ gửi lên Cloudinary
  const params = { timestamp, folder };
  if (publicId) params.public_id = publicId;

  const raw = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(raw + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    // Client chọn resource_type khi upload:
    // - "image" cho ảnh
    // - "raw" cho Word/PDF/zip…
  });
});

module.exports = router;
