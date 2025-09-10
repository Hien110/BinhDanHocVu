const Classroom = require("../models/Classroom");

const ClassRoomController = {
  // Đăng ký khóa học
  registerClassRoom: async (req, res) => {
    try {
      const userId = req.user.userId; // Lấy ID người dùng từ token
      const { courseId } = req.body;
      // gọi hàm Kiểm tra xem người dùng đã đăng ký khóa học chưa
      const isRegistered = await ClassRoomController.checkRegistered(req, res);
      if (isRegistered) {
        return res
          .status(400)
          .json({ message: "Bạn đã đăng ký khóa học này rồi" });
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
        deleted: false,
      });
      if (existingClassRoom) {
        return res
          .status(200)
          .json({ registered: true, message: "Đã đăng ký khóa học" });
      }
      return res
        .status(200)
        .json({ registered: false, message: "Chưa đăng ký khóa học" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },
};

module.exports = ClassRoomController;
