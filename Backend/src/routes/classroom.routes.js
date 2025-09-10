const express = require("express");
const router = express.Router();
const ClassroomController = require("../app/controllers/classroomController");

const authenticateToken = require("../app/middlewares/authMiddleware");
const { authorize } = require("../app/middlewares/authorize");

// Tham gia lớp học
router.post("/join", authenticateToken, authorize("student"), ClassroomController.registerClassRoom);

//Check dăng ký khóa học
router.get("/check/:courseId", authenticateToken, ClassroomController.checkRegistered);

module.exports = router;