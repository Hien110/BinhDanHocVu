const mongoose = require("mongoose");

const questionBankSchema = new mongoose.Schema({
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: false }, 
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("QuestionBank", questionBankSchema);
