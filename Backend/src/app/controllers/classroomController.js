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
          .json({success: true, registered: true, message: "Đã đăng ký khóa học" });
      }
      return res
        .status(200)
        .json({ success: true, registered: false, message: "Chưa đăng ký khóa học" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },
};

module.exports = ClassRoomController;
