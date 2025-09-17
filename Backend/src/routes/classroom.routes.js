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
router.get("/personal-classrooms", authenticateToken, ClassroomController.getRegisteredCourses);

// Rời khỏi lớp học
router.delete("/leave/:classroomId", authenticateToken, ClassroomController.leaveCourse);

module.exports = router;