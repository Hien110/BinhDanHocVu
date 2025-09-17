const { get } = require("mongoose");
const { create } = require("../models/QuestionBank");
const Quiz = require("../models/Quiz");

const QuizController = {
    // Lấy danh sách quiz theo khóa học
    getQuizzesByCourse: async (req, res) => {
        try {
            const { courseId } = req.params;
            const quizzes = await Quiz.find({ course: courseId, deleted: false }).populate("questions.questionBankRef").populate("course");
            res.status(200).json({ data: quizzes, message: "Lấy danh sách bài kiểm tra thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lấy danh sách bài kiểm tra thất bại" });
        }
    },

    // Tạo bài kiểm tra
    createQuiz: async (req, res) => {
        try {
            const newQuiz = req.body;
            const courseId = req.params.courseId;
            console.log(newQuiz);
            
            const quiz = new Quiz({
                ...newQuiz,
                course: courseId,
                createdBy: req.user.userId, // Assuming you have user info in req.user
            });

            await quiz.save();
            res.status(201).json({ message: "Tạo bài kiểm tra thành công", data: quiz });
        } catch (error) {
            res.status(500).json({ message: "Tạo bài kiểm tra thất bại" });
        }
    },

    // Xóa quiz
    deleteQuiz: async (req, res) => {
        try {
            const { quizId } = req.params;
            await Quiz.findByIdAndUpdate(quizId, { deleted: true });
            res.status(200).json({ message: "Xóa bài kiểm tra thành công" });
        } catch (error) {
            res.status(500).json({ message: "Xóa bài kiểm tra thất bại" });
        }
    },

    // Lấy quiz theo Id
    getQuizById: async (req, res) => {
        try {
            const { quizId } = req.params;
            const quiz = await Quiz.findById(quizId).populate("questions");
            if (!quiz) {
                return res.status(404).json({ message: "Bài kiểm tra không tồn tại" });
            }
            res.status(200).json({ data: quiz, message: "Lấy bài kiểm tra thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lấy bài kiểm tra thất bại" });
        }
    },

    //Cập nhập quiz
    updateQuiz: async (req, res) => {
        try {
            const { quizId } = req.params;
            const updateData = req.body;

            const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updateData, { new: true });
            res.status(200).json({ message: "Cập nhật bài kiểm tra thành công", data: updatedQuiz });
        } catch (error) {
            res.status(500).json({ message: "Cập nhật bài kiểm tra thất bại" });
        }
    },

    // Lấy tất cả các quiz
    getAllQuizzes: async (req, res) => {
        try {
            console.log("XIN CHÀO");
            
            const quizzes = await Quiz.find({ deleted: false }).populate("course");
            res.status(200).json({ data: quizzes, message: "Lấy tất cả bài kiểm tra thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lấy tất cả bài kiểm tra thất bại" });
        }
    },

};

module.exports = QuizController;
