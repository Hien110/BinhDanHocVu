import React, { useEffect, useRef, useState } from "react";

import courseService from "../services/courseService";
import lessonService from "../services/lessonService"; // giả sử bạn có service này
import {
  uploadMultipleFilesToCloudinary,
  uploadMultipleImagesToCloudinary,
  uploadToCloudinary,
} from "../services/uploadCloudinary";

import MyEditor from "../components/MyEditor";

import { Link, useParams, useNavigate } from "react-router-dom";

import CourseDetailCard from "../components/CourseDetailCard";

import { ROUTE_PATH } from "../constants/routePath";

import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

function ManageCourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // State tạo bài học mới
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [lessonImages, setLessonImages] = useState([]); // nhiều ảnh
  const [lessonFiles, setLessonFiles] = useState([]); // nhiều file PDF/Word

  // state edit môn học
  const [previewImage, setPreviewImage] = useState("");
  const [editedCourse, setEditedCourse] = useState({
    title: course ? course.title : "",
    description: course ? course.description : "",
    thumbnail: course ? course.thumbnail : null,
  });
  const [loading, setLoading] = useState(false);

  const lessonImagesRef = useRef(null);
  const lessonFilesRef = useRef(null);
  // Load danh sách bài học theo courseId

  const fetchLessons = async () => {
    const res = await lessonService.getLessonsByCourse(courseId);
    if (res.success) setLessons(res.data);
  };

  useEffect(() => {
    // Load course chi tiết
    const fetchCourse = async () => {
      const res = await courseService.getCourseById(courseId);
      if (res.success) {
        setCourse(res.data);
        setEditedCourse({
          title: res.data.title,
          description: res.data.description,
        });
      }
    };

    fetchCourse();
    fetchLessons();
  }, [courseId]);

  // Xử lý tạo bài học mới
  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài học");
      return;
    }

    if (!lessonContent.trim()) {
      toast.error("Vui lòng nhập nội dung bài học");
      return;
    }

    setLoadingLesson(true);

    try {
      // Upload ảnh nội dung
      const imageUrls = await uploadMultipleImagesToCloudinary(lessonImages);

      // Upload file PDF/Word
      const fileUrls = await uploadMultipleFilesToCloudinary(lessonFiles);

      const newLesson = {
        course: courseId,
        title: lessonTitle,
        content: lessonContent,
        videoUrl: lessonVideoUrl,
        imageUrls, // mảng URL ảnh
        fileUrls, // mảng URL file
      };

      const res = await lessonService.createLesson(newLesson);

      if (res.success) {
        toast.success("Tạo bài học thành công");
        setLessons((prev) => [...prev, res.data]);
        setLessonTitle("");
        setLessonContent("");
        setLessonVideoUrl("");
        setLessonImages([]);
        setLessonFiles([]);

        if (lessonImagesRef.current) lessonImagesRef.current.value = "";
        if (lessonFilesRef.current) lessonFilesRef.current.value = "";
        // reset input file nếu muốn: tham khảo thêm bên dưới
        fetchLessons(); // cập nhật lại danh sách bài học
      } else {
        toast.error("Tạo bài học thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi tải file lên Cloudinary hoặc tạo bài học");
      console.error(error);
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleEditorChange = (value) => {
    setLessonContent(value);
  };

  const handleEditorCourseChange = (value) => {
    setEditedCourse((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleViewLesson = (lessonId) => {
    // Navigate to the lesson detail page
    window.location.href = `${ROUTE_PATH.LECTURER_LESSON_DETAIL.replace(
      ":courseId",
      courseId
    ).replace(":lessonId", lessonId)}`;
  };

  // Xử lý xóa bài học
  const handleDeleteLesson = async (lessonId) => {
    const res = await lessonService.deleteLesson(lessonId);
    if (res.success) {
      toast.success("Xóa bài học thành công");
      fetchLessons(); // cập nhật lại danh sách bài học
      setShowDeleteLessonModal(false);
    } else {
      toast.error("Xóa bài học thất bại");
    }
  };

  const closeModals = () => {
    setShowDeleteLessonModal(false);
    setSelectedLesson(null);
    setShowDeleteCourseModal(false);
    setSelectedCourse(null);
    setShowEditModal(false);
  };

  // Xóa khóa học

  const navigate = useNavigate();
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    const res = await courseService.deleteCourse(courseId);
    if (res.success) {
      toast.success("Xóa môn học thành công");
      navigate(ROUTE_PATH.LECTURER_COURSES, {
        state: { fromDelete: true },
      });
      setShowDeleteCourseModal(false);
    } else {
      toast.error("Xóa môn học thất bại");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // cần để cho phép drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setEditedCourse((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedCourse((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditCourse = async () => {
    if (!editedCourse.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề khóa học");
      return;
    }
    if (!editedCourse.description.trim()) {
      toast.error("Vui lòng nhập mô tả khóa học");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = editedCourse.thumbnail;

      if (editedCourse.thumbnail) {
        imageUrl = await uploadToCloudinary(editedCourse.thumbnail);
      }

      const res = await courseService.updateCourse(courseId, {
        title: editedCourse.title,
        description: editedCourse.description,
        thumbnail: imageUrl,
      });
      if (res.success) {
        toast.success("Cập nhật khóa học thành công");
        setCourse(res.course);
        setShowEditModal(false);
        setPreviewImage(null);
      } else {
        toast.error("Cập nhật khóa học thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật khóa học");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (!course) {
    return <div className="min-h-screen">Đang tải khóa học...</div>;
  }

  return (
    <div className=" bg-white ">
      {/* Thông tin khóa học */}
      <div className="pb-6 mb-10 border-b border-gray-300 ">
        <CourseDetailCard course={course} />

        {/* Chỉnh sửa hoặc xóa môn học */}
        <div className="flex space-x-4 justify-start">
          <button
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer text-yellow-600 border border-yellow-600 px-4 py-2 rounded-lg text-sm transition duration-300 hover:bg-yellow-100 font-medium"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => {
              setShowDeleteCourseModal(true);
              setSelectedCourse(course);
            }}
            className="cursor-pointer text-red-600 border border-red-600 px-4 py-2 rounded-lg text-sm transition duration-300 hover:bg-red-100 font-medium"
          >
            Xóa bài học
          </button>
        </div>
      </div>

      {/* Danh sách bài học */}
      <section className="mb-12 border-b border-gray-300 pb-6">
        <h2 className="text-2xl font-semibold text-red-700 mb-6 border-b border-gray-300 pb-2">
          Danh sách bài học
        </h2>

        {/* Tổng số bài học */}
        <div className="mb-4 text-red-400">
          <span className="font-bold text-red-400">Tổng số bài học:</span> {lessons.length}{" "}
          bài học
        </div>
        {lessons.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có bài học nào</p>
        ) : (
          <ul className="space-y-6">
            {lessons.map((lesson, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-between items-center bg-white hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow-600">
                    {lesson.title}
                  </h3>
                  <div className="text-gray-600 line-clamp-1">
                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                  </div>
                </div>
                <div className="">
                  <button
                    onClick={() => handleViewLesson(lesson._id)}
                    className="cursor-pointer text-yellow-600 border border-yellow-600 px-3 py-1 text-sm rounded-lg hover:bg-yellow-100 font-medium transition duration-300"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteLessonModal(true);
                      setSelectedLesson(lesson);
                    }}
                    className="cursor-pointer text-red-600 border border-red-600 px-3 py-1 text-sm rounded-lg hover:bg-red-100 font-medium transition duration-300 ml-3"
                  >
                    Xóa bài học
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Form tạo bài học mới */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-red-700 border-b border-gray-300 pb-2">
          Tạo bài học mới
        </h2>
        {/* onSubmit={handleCreateLesson} */}
        <form className="space-y-6 max-w-full" onSubmit={handleCreateLesson}>
          <div>
            <label
              htmlFor="lessonTitle"
              className="block mb-2 text-yellow-600 font-semibold text-gray-700"
            >
              Tiêu đề bài học
            </label>
            <input
              id="lessonTitle"
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              placeholder="Nhập tiêu đề bài học"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lessonContent"
              className="block mb-2 text-yellow-600 font-semibold text-gray-700"
            >
              Nội dung bài học
            </label>
            <MyEditor
              content={lessonContent}
              onChangeContent={handleEditorChange}
            />
          </div>

          <div>
            <label
              htmlFor="lessonVideoUrl"
              className="block mb-2 font-semibold text-gray-700"
            >
              URL video youtube (nếu có)
            </label>
            <input
              id="lessonVideoUrl"
              type="url"
              value={lessonVideoUrl}
              onChange={(e) => setLessonVideoUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              placeholder="Nhập URL video bài học"
            />
          </div>

          {/* Upload ảnh đại diện */}
          <div>
            <label
              htmlFor="lessonImages"
              className="block mb-2 font-semibold text-gray-700"
            >
              Ảnh nội dung bài học (jpg, png) — có thể chọn nhiều ảnh
            </label>
            <input
              id="lessonImages"
              type="file"
              accept="image/*"
              multiple
              ref={lessonImagesRef}
              onChange={(e) => setLessonImages(Array.from(e.target.files))}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          {/* Upload file PDF hoặc Word */}
          <div>
            <label
              htmlFor="lessonFile"
              className="block mb-2 font-semibold text-gray-700"
            >
              File tài liệu (PDF, Word)
            </label>
            <input
              id="lessonFile"
              type="file"
              accept=".pdf, .doc, .docx"
              multiple
              ref={lessonFilesRef}
              onChange={(e) => setLessonFiles(Array.from(e.target.files))}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loadingLesson}
            className={`w-full py-3 bg-red-600 text-white font-bold rounded-lg 
                      hover:bg-red-700 transition-colors duration-300 
                      disabled:opacity-60 
                      ${loadingLesson ? "cursor-wait" : "cursor-pointer"}`}
          >
            {loadingLesson ? "Đang tạo..." : "Tạo bài học"}
          </button>
        </form>
      </section>

      {/* Modal for deleting lesson */}
      <AnimatePresence>
        {showDeleteLessonModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Xóa bài học
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa bài học{" "}
                <span className="font-semibold text-red-500">
                  {selectedLesson?.title}
                </span>{" "}
                không?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteLesson(selectedLesson?._id);
                }}
              >
                {/* Buttons */}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for deleting course */}
      <AnimatePresence>
        {showDeleteCourseModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Xóa môn học
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa môn học{" "}
                <span className="font-semibold text-red-500">
                  {selectedCourse?.title}
                </span>{" "}
                không?
              </p>
              <p className="text-red-400 mb-4 text-center">
                Việc xóa môn học sẽ xóa hết bài học và không thể khôi phục.
                <br />
                Bạn có chắc chắn muốn tiếp tục?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteCourse();
                }}
              >
                {/* Buttons */}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal chỉnh sửa môn học */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-[#000000c4] flex w-full justify-center items-center z-1200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Chỉnh sửa môn học
              </h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditCourse();
                }}
              >
                {/* Form fields for editing course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên môn học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={course.title}
                    onChange={(e) =>
                      setEditedCourse({
                        ...editedCourse,
                        title: e.target.value,
                      })
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <MyEditor
                    content={course.description}
                    onChangeContent={handleEditorCourseChange}
                  />
                </div>
                {/* Ảnh đại diện */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh đại diện <span className="text-red-500">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-red-400 transition"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="fileInput"
                    />
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer text-red-600 hover:underline"
                    >
                      Chọn hoặc kéo-thả ảnh vào đây
                    </label>

                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mt-4 w-48 h-32 object-cover rounded-xl border shadow-sm mx-auto"
                      />
                    )}
                  </div>
                </div>
                {/* Buttons */}
                <div className="text-right space-x-2 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-[14px]"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded w-full text-[14px] transition-colors duration-300 cursor-pointer
                    ${
                      loading
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageCourseDetailPage;
