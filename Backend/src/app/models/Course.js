const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  code: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["learning", "binhdanso"], default: "learning" },
  subject: { type: String, required: true },
  totalParticipants: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
