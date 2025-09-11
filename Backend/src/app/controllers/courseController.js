const Course = require("../models/Course");
const generateOtp = require("../../utils/generateOTP");

const CourseController = {
  // Tạo khóa học
  createCourse: async (req, res) => {
    try {
      const userId = req.user.userId; // Lấy ID người dùng từ token
      const code = generateOtp();
      const newCourse = new Course({
        ...req.body,
        instructor: userId, // Gán người tạo khóa học
        code,
      });
      await newCourse.save();
      res
        .status(201)
        .json({ data: newCourse, message: "Khóa học đã được tạo thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo khóa học" });
    }
  },

  // Lấy toàn bộ khóa học
  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find({ deleted: false });
      res
        .status(200)
        .json({ data: courses, message: "Lấy toàn bộ khóa học thành công" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        message: "Lỗi khi lấy toàn bộ khóa học",
      });
    }
  },

  // Lấy khóa học theo người tạo
  getCoursesByInstructor: async (req, res) => {
    try {
      const instructorId = req.user.userId; // Lấy ID người dùng từ token
      const courses = await Course.find({
        instructor: instructorId,
        deleted: false,
      });
      res.status(200).json({
        data: courses,
        message: "Lấy khóa học theo giảng viên thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        message: "Lỗi khi lấy khóa học theo giảng viên",
      });
    }
  },

  // Lấy khóa học theo Id
  getCourseById: async (req, res) => {
    try {
      const courseId = req.params.courseId;

      // populate instructor details trừ password
      const course = await Course.findById(courseId).populate("instructor", "-password");
      if (!course) {
        return res.status(404).json({ message: "Khóa học không tồn tại" });
      }
      res
        .status(200)
        .json({ data: course, message: "Lấy khóa học thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy khóa học theo ID" });
    }
  },

  //Xóa khóa học
  deleteCourse: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const deletedCourse = await Course.findByIdAndUpdate(
        courseId,
        { deleted: true },
        { new: true }
      );
      res
        .status(200)
        .json({ data: deletedCourse, message: "Xóa khóa học thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa khóa học" });
    }
  },

  //Cập nhập khóa học
  updateCourse: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
        new: true,
      });
      if (!updatedCourse) {
        return res.status(404).json({ message: "Khóa học không tồn tại" });
      }
      res
        .status(200)
        .json({ data: updatedCourse, message: "Cập nhật khóa học thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật khóa học" });
    }
  },

  // Lấy mỗi 3 khóa học theo mỗi subject
  getTop3CoursesBySubject: async (req, res) => {
    try {
      // Lấy danh sách tất cả các subject
      const subjects = await Course.distinct("subject");

      // Sử dụng Promise.all để thực hiện các truy vấn song song
      const coursesBySubject = await Promise.all(
        subjects.map(async (subject) => {
          const courses = await Course.find({ subject, deleted: false })
            .limit(3)
            .populate("instructor", "fullName");
          return { subject, courses };
        })
      );

      // Chuyển đổi mảng kết quả thành một object với subject làm key
      const coursesBySubjectObject = coursesBySubject.reduce(
        (acc, { subject, courses }) => {
          acc[subject] = courses;
          return acc;
        },
        {}
      );

      res.status(200).json({
        data: coursesBySubjectObject,
        message: "Lấy khóa học theo môn học thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi lấy khóa học theo môn học" });
    }
  },
};

module.exports = CourseController;
