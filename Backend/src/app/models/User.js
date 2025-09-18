const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["student", "lecturer", "admin"], required: true, default: "student" },
    avatar: { type: String }, // URL ảnh đại diện
    workplace: { type: String }, // Nơi làm việc
    bio: { type: String }, // Thông tin giới thiệu bản thân
    status: { type: String, enum: ['active', 'locked', 'non-active'], default: 'non-active' },
    approved: { type: Boolean, default: false }, // Duyệt tài khoản giảng viên
    gender: { type: Boolean }, // true: nam, false: nữ
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

// Định nghĩa method comparePassword
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
