const express = require("express");
const router = express.Router();
const ClassroomController = require("../app/controllers/classroomController");

const authenticateToken = require("../app/middlewares/authMiddleware");
const { authorize } = require("../app/middlewares/authorize");

// Tham gia lớp học
router.post("/join", authenticateToken, authorize("student", 'lecturer'), ClassroomController.registerClassRoom);

//Check dăng ký khóa học
router.get("/check/:courseId", authenticateToken, ClassroomController.checkRegistered);

// Lấy danh sách lớp học của người dùng
router.get("/personal-classrooms/:userId", authenticateToken, ClassroomController.getRegisteredCourses);

// Rời khỏi lớp học
router.delete("/leave/:classroomId", authenticateToken, ClassroomController.leaveCourse);

// Lấy danh sách học sinh trong một khóa học (dành cho giảng viên)
router.get("/course/:courseId/students", authenticateToken, authorize("lecturer"), ClassroomController.getStudentsInCourse);

module.exports = router;