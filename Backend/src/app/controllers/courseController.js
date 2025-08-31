const { get } = require("mongoose");
const Course = require("../models/Course");

const CourseController = {
    // Tạo khóa học
    createCourse: async (req, res) => {
        try {
            const userId = req.user.userId; // Lấy ID người dùng từ token
            const newCourse = new Course({
                ...req.body,
                instructor: userId, // Gán người tạo khóa học
            });
            await newCourse.save();
            res.status(201).json({ data: newCourse, message: "Khóa học đã được tạo thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tạo khóa học" });
        }
    },

    // Lấy toàn bộ khóa học
    getAllCourses: async (req, res) => {
        try {
            const courses = await Course.find({ deleted: false });
            res.status(200).json({ data: courses, message: "Lấy toàn bộ khóa học thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message, message: "Lỗi khi lấy toàn bộ khóa học" });
        }
    },

    // Lấy khóa học theo người tạo
    getCoursesByInstructor: async (req, res) => {
        try {
            const instructorId = req.user.userId; // Lấy ID người dùng từ token
            const courses = await Course.find({ instructor: instructorId, deleted: false });
            res.status(200).json({data: courses, message: "Lấy khóa học theo giảng viên thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message, message: "Lỗi khi lấy khóa học theo giảng viên" });
        }
    },

    // Lấy khóa học theo Id
    getCourseById: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const course = await Course.findById(courseId).populate("instructor", "name"); // Lấy thông tin giảng viên
            if (!course) {
                return res.status(404).json({ message: "Khóa học không tồn tại" });
            }
            res.status(200).json({ data: course, message: "Lấy khóa học thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy khóa học theo ID" });
        }
    },

    //Xóa khóa học
    deleteCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const deletedCourse = await Course.findByIdAndUpdate(courseId, { deleted: true }, { new: true });
            res.status(200).json({ data: deletedCourse, message: "Xóa khóa học thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi xóa khóa học" });
        }
    },

    //Cập nhập khóa học
    updateCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
            if (!updatedCourse) {
                return res.status(404).json({ message: "Khóa học không tồn tại" });
            }
            res.status(200).json({ data: updatedCourse, message: "Cập nhật khóa học thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi cập nhật khóa học" });
        }
    },

};

module.exports = CourseController;
