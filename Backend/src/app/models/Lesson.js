const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  //content có thể là ảnh hoặc nội dung văn bản hoặc video, có thứ tự để biết vị trí sắp xếp
  content: [
    {
      type: { type: String, enum: ["text", "image", "video"], required: true }, // Loại nội dung
      value: { type: String, required: true }, // Giá trị nội dung
      order: { type: Number, required: true } // Thứ tự hiển thị
    }
  ],
  fileUrls: [{ type: String }],
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);
