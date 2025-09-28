const express = require('express');
const router = express.Router();

const authenticateToken = require("../app/middlewares/authMiddleware");
const { authorize } = require("../app/middlewares/authorize");

const LessonController = require('../app/controllers/lessonController');

// Tạo bài học
router.post('/:courseId/lessons', authenticateToken, authorize("lecturer", "admin"), LessonController.createLesson);

// Lấy toàn bộ bài học theo khóa học
router.get('/:courseId/lessons', LessonController.getLessonsByCourse);

// Lấy bài học theo ID
router.get('/:lessonId', LessonController.getLessonById);

// Xóa bài học
router.delete('/deleted/:lessonId', authenticateToken, authorize("lecturer"), LessonController.deleteLesson);

// Cập nhật bài học
router.put('/update/:lessonId', authenticateToken, authorize("lecturer"), LessonController.updateLesson);

// Lấy tất cả bài học
router.get('/', LessonController.getAllLessons);

module.exports = router;