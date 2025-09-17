const Classroom = require("../models/Classroom");
const Course = require("../models/Course");

const ClassRoomController = {
  // Đăng ký khóa học
  registerClassRoom: async (req, res) => {
    try {
      const userId = req.user.userId; // Lấy ID người dùng từ token
      const { courseId } = req.body;
      // gọi hàm Kiểm tra xem người dùng đã đăng ký khóa học chưa
      const isRegistered = await Classroom.findOne({
        student: userId,
        course: courseId,
      });

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(400).json({ message: "Khóa học không tồn tại" });
      }

      if (isRegistered) {
        return res
          .status(400)
          .json({ message: "Bạn đã đăng ký khóa học này rồi" });
      }

      // Kiểm tra khóa học có tồn tại không
      if (!course) {
        return res.status(400).json({ message: "Khóa học không tồn tại" });
      }

      const newClassRoom = new Classroom({
        student: userId,
        course: courseId,
      });
      await newClassRoom.save();

      // Gắn tổng số học sinh vào trong Course ClassroomController
      const totalStudents = await ClassRoomController.countStudentsInCourse(courseId);
      course.totalParticipants = totalStudents;
      await course.save();
      return res.status(201).json({ message: "Đăng ký khóa học thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Check xem người đó đã đăng kí khóa học chưa
  checkRegistered: async (req, res) => {
    try {
      const userId = req.user.userId; // Lấy ID người dùng từ token
      const courseId = req.params.courseId;
      // Kiểm tra xem người dùng đã đăng ký khóa học chưa
      const existingClassRoom = await Classroom.findOne({
        student: userId,
        course: courseId,
      });
      if (existingClassRoom) {
        return res
          .status(200)
          .json({
            success: true,
            registered: true,
            message: "Đã đăng ký khóa học",
          });
      }
      return res
        .status(200)
        .json({
          success: true,
          registered: false,
          message: "Chưa đăng ký khóa học",
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Lấy danh sách khóa học đã đăng ký của người dùng
  getRegisteredCourses: async (req, res) => {
    try {
      const userId = req.user.userId; // Lấy ID người dùng từ token
      const registeredCourses = await Classroom.find({
        student: userId,
      }).populate({
        path: "course",
        populate: {
          path: "instructor", // field trong Course
          model: "User", // model liên kết
          select: "fullName email avatar role", // chọn field cần thiết (nếu muốn)
        },
      });
      return res
        .status(200)
        .json({
          success: true,
          data: registeredCourses,
          message: "Lấy danh sách khóa học thành công",
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Rời khỏi khóa học
  leaveCourse: async (req, res) => {
    try {
      const classroomId = req.params.classroomId;
      
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) {
        return res.status(404).json({ message: "Học sinh không có trong lớp học" });
      }
      await Classroom.findByIdAndDelete(classroomId);

      const course = await Course.findById(classroom.course._id);

      // Gắn tổng số học sinh vào trong Course ClassroomController
      const totalStudents = await ClassRoomController.countStudentsInCourse(course._id);
      course.totalParticipants = totalStudents;
      await course.save();
      return res.status(200).json({ message: "Rời khỏi khóa học thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // This function is not used in the current implementation but can be useful for future features
  countStudentsInCourse: async (courseId) => {
    try {
      const count = await Classroom.countDocuments({ course: courseId });
      return count;
    } catch (error) {
      console.error("Error counting students in course:", error);
      throw error;
    }
  },

  // Lấy danh sách học sinh trong một khóa học
  getStudentsInCourse: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const students = await Classroom.find({ course: courseId }).populate({
        path: "student",
        select: "fullName email avatar",
      }).populate("course");
      return res.status(200).json({
        success: true,
        data: students,
        message: "Lấy danh sách học sinh thành công",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

};

module.exports = ClassRoomController;
