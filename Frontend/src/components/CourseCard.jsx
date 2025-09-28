import React, { useState } from "react";

import { ROUTE_PATH } from "../constants/routePath";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import courseService from "../services/courseService";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";

import { toast } from "sonner";

function CourseCard({ course, message }) {
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = userService.getCurrentUser();
  const isAdmin = user?.role === "admin";

  const closeModals = () => {
    setShowDeleteCourseModal(false);
    setSelectedCourse(null);
    setLoading(false);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const result = await courseService.deleteCourse(selectedCourse._id);
      if (result.success) {
        // Xử lý thành công, có thể hiển thị thông báo hoặc cập nhật giao diện
        toast.success("Xóa khóa học thành công");
        // chờ 1s để người dùng thấy thông báo
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // Tự động đóng modal sau khi xóa thành công
      } else {
        toast.error("Xóa khóa học thất bại");
      }
      setShowDeleteCourseModal(false);
      setSelectedCourse(null);
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete course:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Thumbnail */}
      <div
        key={course._id}
        className="bg-white rounded-xl shadow-md overflow-hidden course-card transition duration-300 transform hover:translate-y-1"
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="group-hover:scale-105 transition-transform duration-500 rounded-xl w-full aspect-[3/2] object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {course.title}
          </h3>
          {/* giáo viên */}
          {message === "ClassWereJoined" && (
            <div className="mb-2 flex flex-row items-center text-sm">
              Giáo viên:{" "}
              <span className="pl-1 font-medium text-gray-800">
                {course?.instructor?.fullName || "N/A"}
              </span>
            </div>
          )}

          <div className="mb-2 flex flex-row items-center text-sm">
            <CalendarMonthIcon
              fontSize="small"
              className="text-gray-500 mr-1 w-4 h-4"
            />
            <span className="font-medium text-gray-800">
              {course?.createdAt
                ? new Date(course.createdAt).toLocaleDateString("vi-VN")
                : "N/A"}
            </span>
          </div>
          <div className="mb-2 flex flex-row items-center text-sm">
            <i className="fa-solid fa-eye text-gray-500 mr-2 ml-1 w-4 h-4"></i>
            {course.type === "learning" ? (
              <span className="font-medium text-gray-800">
                {course?.totalParticipants || 0} học viên
              </span>
            ) : (
              <span className="font-medium text-gray-800">
                {course?.viewCount || 0} lượt xem
              </span>
            )}
          </div>
          <div className="flex flex-col w-full">
            {!isAdmin && (
              <Link
                to={`${ROUTE_PATH.LECTURER_COURSE_DETAIL.replace(
                  ":courseId",
                  course._id
                ).replace(
                  ":courseName",
                  course.title.replace(/\s+/g, "-").toLowerCase()
                )}`}
                className="relative w-full text-center text-custom-blue font-medium border border-custom-blue cursor-pointer rounded-lg px-4 py-2 overflow-hidden
                              before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-blue-50 before:transition-all before:duration-300 before:z-0
                              hover:before:w-full mb-3 flex justify-center items-center"
              >
                <span className="relative z-10 text-sm">
                  Xem chi tiết{" "}
                  <ArrowForwardTwoToneIcon
                    fontSize="inherit"
                    className="inline-block pb-0.5"
                  />
                </span>
              </Link>
            )}
            {isAdmin &&
              (course.instructor?.role === "admin" ? (
                <>
                  <Link
                    to={`${ROUTE_PATH.LECTURER_COURSE_DETAIL.replace(
                      ":courseId",
                      course._id
                    ).replace(
                      ":courseName",
                      course.title.replace(/\s+/g, "-").toLowerCase()
                    )}`}
                    className="relative w-full text-center text-custom-blue font-medium border border-custom-blue cursor-pointer rounded-lg px-4 py-2 overflow-hidden
                              before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-blue-50 before:transition-all before:duration-300 before:z-0
                              hover:before:w-full mb-3 flex justify-center items-center"
                  >
                    <span className="relative z-10 text-sm">
                      Xem chi tiết{" "}
                      <ArrowForwardTwoToneIcon
                        fontSize="inherit"
                        className="inline-block pb-0.5"
                      />
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <div>
                    <Link
                      to={`${ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
                        ":courseId",
                        course._id
                      ).replace(
                        ":courseName",
                        course.title.replace(/\s+/g, "-").toLowerCase()
                      )}`}
                      className="relative w-full text-center text-custom-blue font-medium border border-custom-blue cursor-pointer rounded-lg px-4 py-2 overflow-hidden
                              before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-blue-50 before:transition-all before:duration-300 before:z-0
                              hover:before:w-full mb-3 flex justify-center items-center"
                    >
                      <span className="relative z-10 text-sm">
                        Xem chi tiết{" "}
                        <ArrowForwardTwoToneIcon
                          fontSize="inherit"
                          className="inline-block pb-0.5"
                        />
                      </span>
                    </Link>
                    {message === "CourseTaught" && (
                      <button
                        onClick={() => {
                          setShowDeleteCourseModal(true);
                          setSelectedCourse(course);
                        }}
                        className="relative w-full text-center text-red-500 font-medium border border-red-500 cursor-pointer rounded-lg px-4 py-2 overflow-hidden
             before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-red-50 before:transition-all before:duration-300 before:z-0
             hover:before:w-full"
                      >
                        <span className="relative z-10 text-sm">
                          Xóa khóa học
                        </span>
                      </button>
                    )}
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
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
                của giáo viên{" "}
                <span className="font-semibold text-red-500">
                  {selectedCourse?.instructor?.fullName ||
                    "Giáo viên không xác định"}
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
                      bgcolor: !loading ? "#e43939" : "grey.400",
                      transition:
                        "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: !loading ? "#dd1c1cff" : "grey.400",
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        bgcolor: "grey.400",
                        cursor: "not-allowed",
                        opacity: 1,
                      },
                    }}
                  >
                    {loading ? "Đang xử lý..." : "Xóa khóa học"}
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

export default CourseCard;
