const express = require("express");
const router = express.Router();
const CourseController = require("../app/controllers/courseController");

const authenticateToken = require("../app/middlewares/authMiddleware");
const { authorize } = require("../app/middlewares/authorize");

// Tạo môn học
router.post("/create", authenticateToken, authorize("lecturer", "admin"), CourseController.createCourse);

// Lấy khóa học theo người tạo
router.get("/instructor/:instructorId", authenticateToken, CourseController.getCoursesByInstructor);

// Lấy khóa học theo ID
router.get("/:courseId", CourseController.getCourseById);

// Xóa khóa học
router.put("/deleted/:courseId", authenticateToken, authorize("lecturer", "admin"), CourseController.deleteCourse);

// Cập nhật khóa học
router.put("/update/:courseId", authenticateToken, authorize("lecturer", "admin"), CourseController.updateCourse);

// Lấy toàn bộ khóa học
router.get("/", CourseController.getAllCourses);

// Lấy 3 khóa học theo mỗi môn học
router.get("/subject/top3", CourseController.getTop3CoursesBySubject);

// Lấy khóa học Bình dân số
router.get("/subject/binh-dan-so", CourseController.getBinhDanSoCourses);

module.exports = router;