const express = require('express');
const router = express.Router();

const QuizController = require('../app/controllers/quizController');

const authenticateToken = require("../app/middlewares/authMiddleware");
const { authorize } = require("../app/middlewares/authorize");

// Lấy tất cả các quiz
router.get('/all-quiz', QuizController.getAllQuizzes);

//Lấy quiz theo course
router.get('/:courseId/quizzes', QuizController.getQuizzesByCourse);

//Tạo bài kiểm tra  
router.post('/:courseId/quizzes', authenticateToken, authorize("lecturer"), QuizController.createQuiz);

//xóa bài kiểm tra
router.put('/:courseId/quizzes/:quizId', authenticateToken, authorize("lecturer"), QuizController.deleteQuiz);

//Lấy quiz theo Id 
router.get('/quizzes/:quizId', authenticateToken, QuizController.getQuizById);

//Update quiz theo id
router.put('/quizzes/:quizId', authenticateToken, authorize("lecturer"), QuizController.updateQuiz);

module.exports = router;