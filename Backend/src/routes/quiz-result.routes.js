const express = require('express');
const quizResultController = require('../app/controllers/quizResultController');
const router = express.Router();

const authenticateToken = require("../app/middlewares/authMiddleware");
const { authorize } = require("../app/middlewares/authorize");

// Tạo kết quả quiz
router.post('/', authenticateToken, authorize('student', 'lecturer'), quizResultController.create);

// Lấy kết quả quizResult theo Id
router.get('/quizReult/:quizResultId', authenticateToken, quizResultController.getQuizResultById);

// Lấy kết quả quizResult theo khóa học
router.get('/course/:courseId', authenticateToken, authorize('student', 'lecturer'), quizResultController.getQuizResultsByCourse);

// Lấy kết quả theo userId
router.get('/user/getAllResult/:userId', authenticateToken, authorize('student', 'lecturer'), quizResultController.getQuizResultsByUserId);

// Lấy kết quả quiz theo quizId
router.get('/quiz/:quizId', authenticateToken, authorize('student', 'lecturer'), quizResultController.getQuizResultsByQuizId);

// Lấy nhiều quizResult theo userId và quizId
router.get('/:userId/:quizId', authenticateToken, authorize('student'), quizResultController.getByUserIdAndQuizId);

// Lấy tất cả kết quả quiz
router.get('/', authenticateToken, authorize('lecturer'), quizResultController.getAllQuizResults);

module.exports = router;