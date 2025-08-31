const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: false },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  questions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "QuestionBank" }
  ],
  timeLimit: { type: Number }, // số phút giới hạn thời gian
  totalQuestions: { type: Number, default: 0 }, // tổng số câu hỏi trong quiz
  attempts: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  typeQuiz: { type: String, enum: ["manual", "excel", "random"], default: "manual" }, // loại quiz
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);
