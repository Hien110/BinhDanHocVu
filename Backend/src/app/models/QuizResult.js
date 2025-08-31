const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  score: { type: Number },
  correctAnswers: { type: Number },
  answers: [{
    questionBankRef: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionBank" },
    selectedOptionIndex: [Number]
  }]
}, { timestamps: true });

module.exports = mongoose.model("QuizResult", quizResultSchema);
