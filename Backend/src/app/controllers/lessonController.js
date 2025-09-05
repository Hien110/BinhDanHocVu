const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

class LessonController {
  // Tạo bài học
  async createLesson(req, res) {
    try {
      const courseIdFromParam = req.params.courseId;
      const {
        course: courseIdFromBody,
        title,
        content = [],
        fileUrls = [],
      } = req.body || {};

      // Lấy courseId cuối cùng
      const courseId = courseIdFromParam ?? courseIdFromBody;

      // Trường hợp có cả param và body nhưng không khớp
      if (
        courseIdFromParam &&
        courseIdFromBody &&
        courseIdFromParam !== courseIdFromBody
      ) {
        return res.status(400).json({
          success: false,
          message: "courseId trong URL và body không khớp",
        });
      }

      if (!courseId) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu courseId" });
      }

      // Kiểm tra khoá học tồn tại
      const course = await Course.findById(courseId).lean();
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Khóa học không tồn tại" });
      }

      // Validate title
      if (typeof title !== "string" || !title.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Tiêu đề bài học không hợp lệ" });
      }

      // Validate content
      if (!Array.isArray(content)) {
        return res
          .status(400)
          .json({ success: false, message: "Content phải là mảng" });
      }

      const ALLOWED_TYPES = new Set(["text", "image", "video"]);
      const normalized = content
        .map((item, i) => {
          const type = item?.type;
          const value = (item?.value ?? "").toString().trim();
          const order = Number.isFinite(item?.order) ? Number(item.order) : i;
          return { type, value, order };
        })
        .filter((it) => ALLOWED_TYPES.has(it.type) && it.value);

      if (normalized.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Content trống hoặc không hợp lệ" });
      }

      // Sort theo order và re-index 0..n-1
      normalized.sort((a, b) => a.order - b.order);
      const contentForDb = normalized.map((it, idx) => ({ ...it, order: idx }));

      // Chuẩn hoá fileUrls
      const safeFileUrls = Array.isArray(fileUrls)
        ? fileUrls.filter((u) => typeof u === "string" && u.trim())
        : [];

      // Tạo document
      const newLesson = new Lesson({
        course: courseId,
        title: title.trim(),
        content: contentForDb,
        fileUrls: safeFileUrls,
        deleted: false,
      });

      await newLesson.save();

      return res
        .status(201)
        .json({
          success: true,
          data: newLesson,
          message: "Bài học đã được tạo thành công",
        });
    } catch (error) {
      console.error("createLesson error:", error);
      if (error?.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          details: error.errors,
        });
      }
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khi tạo bài học" });
    }
  }

  // Lấy toàn bộ bài học theo khóa học
  async getLessonsByCourse(req, res) {
    try {
      const courseId = req.params.courseId;
      const lessons = await Lesson.find({ course: courseId, deleted: false });
      res
        .status(200)
        .json({ data: lessons, message: "Lấy danh sách bài học thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Lấy bài học theo ID
  async getLessonById(req, res) {
    try {
      const lessonId = req.params.lessonId;
      const lesson = await Lesson.findById(lessonId, {
        deleted: false,
      }).populate("course", "title"); // Lấy thông tin khóa học
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

      //dùng lệnh delete cứng
      const deletedLesson = await Lesson.findByIdAndDelete(lessonId);
      if (!deletedLesson) {
        return res.status(404).json({ message: "Bài học không tồn tại" });
      }
      res
        .status(200)
        .json({ data: deletedLesson, message: "Xóa bài học thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa bài học" + error });
    }
  }

  // Cập nhập bài học
  async updateLesson(req, res) {
    try {
      const lessonId = req.params.lessonId;
      const updatedData = req.body;

      const updatedLesson = await Lesson.findByIdAndUpdate(
        lessonId,
        updatedData,
        { new: true }
      );
      if (!updatedLesson) {
        return res.status(404).json({ message: "Bài học không tồn tại" });
      }
      res
        .status(200)
        .json({ data: updatedLesson, message: "Cập nhật bài học thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật bài học" });
    }
  }

  // Lấy tất cả bài học
  async getAllLessons(req, res) {
    try {
      const lessons = await Lesson.find({ deleted: false }).populate(
        "course",
        "title"
      );
      res
        .status(200)
        .json({ data: lessons, message: "Lấy tất cả bài học thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy tất cả bài học" });
    }
  }
}

module.exports = new LessonController();
