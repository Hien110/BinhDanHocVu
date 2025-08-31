const express = require('express');
const router = express.Router();
const QuestionBankController = require('../app/controllers/questionBankController');

const uploadExcel = require('../app/middlewares/uploadExcel');

const authenticateToken = require("../app/middlewares/authMiddleware");
const { authorize } = require("../app/middlewares/authorize");

// lấy tất cả câu hỏi
router.get('/', QuestionBankController.getAllQuestions);

// tạo câu hỏi mới
router.post('/', authenticateToken, authorize('lecturer'), QuestionBankController.createQuestion);

// Cập nhập câu hỏi
router.put('/update/:questionId', authenticateToken, authorize('lecturer'), QuestionBankController.updateQuestion);

// Xóa câu hỏi
router.put('/delete/:questionId', authenticateToken, authorize('lecturer'), QuestionBankController.deleteQuestion);

// Lấy câu hỏi theo ID
router.get('/:questionId', authenticateToken, QuestionBankController.getQuestionById);

// Lấy câu hỏi theo khóa học
router.get('/course/:courseId', QuestionBankController.getQuestionByCourse);

// Tải lên file Excel
router.post('/upload-excel/:courseId', authenticateToken, authorize('lecturer'), uploadExcel.single('file'), QuestionBankController.uploadExcel);

// Xóa tất cả câu hỏi theo khóa học
router.put('/course/:courseId', authenticateToken, authorize('lecturer'), QuestionBankController.deleteAllQuestionsByCourse);

module.exports = router;