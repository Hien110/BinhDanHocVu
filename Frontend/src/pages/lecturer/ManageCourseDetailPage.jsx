import React, { useEffect, useState } from "react";

import courseService from "../../services/courseService";
import lessonService from "../../services/lessonService"; // giả sử bạn có service này
import { uploadToCloudinary } from "../../services/uploadCloudinary";

import MyEditor from "../../components/MyEditor";

import { useParams, useNavigate, Link } from "react-router-dom";

import CourseDetailCard from "../../components/CourseDetailCard";

import { ROUTE_PATH } from "../../constants/routePath";

import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@mui/material";

import { ChevronRight } from "lucide-react";

function ManageCourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // state edit môn học
  const [previewImage, setPreviewImage] = useState("");
  const [editedCourse, setEditedCourse] = useState({
    title: course ? course.title : "",
    description: course ? course.description : "",
    thumbnail: course ? course.thumbnail : null,
  });
  const [loading, setLoading] = useState(false);

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
  }, [courseId]);

  const handleEditorCourseChange = (value) => {
    setEditedCourse((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const closeModals = () => {
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Danh sách môn học
      </h1>
      <div className="pb-6 mb-10 border-b border-gray-300 ">
        <CourseDetailCard course={course} />

        {/* Chỉnh sửa hoặc xóa môn học */}
        <div className="flex space-x-4 justify-center mt-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer text-custom-hover-orange border border-yellow-600 px-4 py-2 rounded-lg text-sm transition duration-300 hover:bg-custom-hover-orange2 font-medium"
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
            Xóa khóa học
          </button>
        </div>
      </div>

      {/* Tạo các ô để đi đến các quản lí khác như danh sách bài học, danh sách học viên, ngân hàng câu hỏi */}
      <div className="flex flex-col gap-4 mt-6 mb-10">
        <Link
          to={ROUTE_PATH.LECTURER_LESSON_LIST.replace(":courseId", courseId)}
          className="flex items-center justify-between px-5 py-3 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-md transition duration-300 hover:bg-custom-hover-blue2 hover:shadow-lg"
        >
          Danh sách bài học
          <ChevronRight className="w-5 h-5 text-custom-blue" />
        </Link>

        <Link className="flex items-center justify-between px-5 py-3 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-md transition duration-300 hover:bg-custom-hover-blue2 hover:shadow-lg">
          Danh sách học viên
          <ChevronRight className="w-5 h-5 text-custom-blue" />
        </Link>

        <Link
          to={ROUTE_PATH.LECTURER_QUESTION_BANK_DETAIL.replace(
            ":courseId",
            courseId
          ).replace(
            ":courseName",
            course.title.replace(/\s+/g, "-").toLowerCase()
          )}
          className="flex items-center justify-between px-5 py-3 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-md transition duration-300 hover:bg-custom-hover-blue2 hover:shadow-lg"
        >
          Ngân hàng câu hỏi
          <ChevronRight className="w-5 h-5 text-custom-blue" />
        </Link>

        <Link
          to={ROUTE_PATH.LECTURER_QUIZ_LIST.replace(
            ":courseId",
            courseId
          ).replace(
            ":courseName",
            course.title.replace(/\s+/g, "-").toLowerCase()
          )}
          className="flex items-center justify-between px-5 py-3 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-md transition duration-300 hover:bg-custom-hover-blue2 hover:shadow-lg"
        >
          Bài kiểm tra
          <ChevronRight className="w-5 h-5 text-custom-blue" />
        </Link>

        <Link className="flex items-center justify-between px-5 py-3 rounded-xl border border-custom-blue text-custom-blue font-semibold shadow-md transition duration-300 hover:bg-custom-hover-blue2 hover:shadow-lg">
          Kết quả bài kiểm tra
          <ChevronRight className="w-5 h-5 text-custom-blue" />
        </Link>
      </div>

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
              <h2 className="text-xl font-bold text-custom-blue mb-4">
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
                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-custom-hover-blue transition"
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
                      className="cursor-pointer text-custom-blue hover:underline"
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
                <div className="text-right gap-4 flex justify-end">
                  <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    fullWidth
                    disabled={loading}
                    onClick={() => closeModals()}
                    sx={{
                      py: "8px",
                      px: "16px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      borderRadius: "6px",
                      textTransform: "none",
                      color: "white",
                      bgcolor: "grey.600",
                      transition:
                        "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: "grey.700",
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        bgcolor: "grey.400",
                        cursor: "not-allowed",
                        opacity: 1,
                      },
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={loading} // 👈 Thêm prop này
                    disableElevation
                    fullWidth
                    disabled={loading} // 👈 tránh user bấm khi đang loading
                    sx={{
                      py: "8px",
                      px: "16px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      borderRadius: "6px",
                      textTransform: "none",
                      color: "white",
                      bgcolor: !loading ? "#4A90E2" : "grey.400",
                      transition:
                        "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: !loading ? "#357ABD" : "grey.400",
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        bgcolor: "grey.400",
                        cursor: "not-allowed",
                        opacity: 1,
                      },
                    }}
                  >
                    {loading ? "Đang xử lý..." : "Tạo khóa học"}
                  </Button>
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
