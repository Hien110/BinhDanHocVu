const Lesson = require('../models/Lesson');

class LessonController {
    // Tạo bài học
    async createLesson(req, res) {
        try {
            const courseId = req.params.courseId;
            const newLesson = new Lesson({
                ...req.body,
                course: courseId, // Gán khóa học cho bài học
            });

            await newLesson.save();
            res.status(201).json({ data: newLesson, message: "Bài học đã được tạo thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tạo bài học" });
        }
    }

    // Lấy toàn bộ bài học theo khóa học
     async getLessonsByCourse(req, res) {
        try {
            const courseId = req.params.courseId;
            const lessons = await Lesson.find({ course: courseId, deleted: false });
            res.status(200).json({ data: lessons, message: "Lấy danh sách bài học thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy bài học theo ID
    async getLessonById(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const lesson = await Lesson.findById(lessonId, { deleted: false }).populate("course", "title"); // Lấy thông tin khóa học
            if (!lesson) {
                return res.status(404).json({ message: "Bài học không tồn tại" });
            }
            res.status(200).json({ data: lesson, message: "Lấy bài học thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy bài học theo ID" });
        }
    }

    //xóa bài học
    async deleteLesson(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const deletedLesson = await Lesson.findByIdAndUpdate(lessonId, { deleted: true }, { new: true });
            if (!deletedLesson) {
                return res.status(404).json({ message: "Bài học không tồn tại" });
            }
            res.status(200).json({ data: deletedLesson, message: "Xóa bài học thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi xóa bài học" });
        }
    }

    // Cập nhập bài học
    async updateLesson(req, res) {
        try {
            const lessonId = req.params.lessonId;
            const updatedData = req.body;

            const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updatedData, { new: true });
            if (!updatedLesson) {
                return res.status(404).json({ message: "Bài học không tồn tại" });
            }
            res.status(200).json({ data: updatedLesson, message: "Cập nhật bài học thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi cập nhật bài học" });
        }
    }

    // Lấy tất cả bài học
    async getAllLessons(req, res) {
        try {
            const lessons = await Lesson.find({ deleted: false }).populate("course", "title");
            res.status(200).json({ data: lessons, message: "Lấy tất cả bài học thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy tất cả bài học" });
        }
    }
}

module.exports = new LessonController();