// middlewares/uploadExcel.js
const multer = require("multer");

// Dùng memoryStorage thay vì diskStorage
const storage = multer.memoryStorage();

// Bộ lọc chỉ cho phép Excel
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel" // .xls
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép file Excel (.xls, .xlsx)"), false);
  }
};

const uploadExcel = multer({ storage, fileFilter });

module.exports = uploadExcel;
