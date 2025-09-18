import React, { useEffect, useRef, useState } from "react";

import classroomService from "../../services/classroomService";
import userService from "../../services/userService";

import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

import { ROUTE_PATH } from "../../constants/routePath";

/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function MyCoursePage() {
  const [courses, setCourses] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [showModalLeave, setShowModalLeave] = useState(false);
  const [courseToLeave, setCourseToLeave] = useState(null);

  const user = userService.getCurrentUser();

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await classroomService.getUserClassRooms(user._id);
      if (response.success) {
        console.log(response.data);

        setCourses(response.data);
      }
    };
    fetchCourses();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 2 ref để nhận biết click ngoài
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      // nếu không có menu đang mở thì bỏ qua
      if (!openMenu) return;

      const menuEl = menuRef.current;
      const btnEl = buttonRef.current;

      // nếu click không nằm trong menu và cũng không nằm trong nút toggle -> đóng
      if (
        menuEl &&
        !menuEl.contains(e.target) &&
        btnEl &&
        !btnEl.contains(e.target)
      ) {
        setOpenMenu(null);
      }
    }

    // dùng mousedown để đóng nhanh, có thể đổi sang 'click'
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const closeModals = () => {
    setShowModalLeave(false);
    setCourseToLeave(null);
  };

  const handleLeaveCourse = async () => {
    try {
      const result = await classroomService.leaveClassRoom(courseToLeave._id);
      if (result.success) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseToLeave._id)
        );
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      closeModals();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Khóa học của tôi
      </h1>

      <ul className="space-y-6">
        {courses.length === 0 && (
          <li className="text-gray-500 min-h-screen">Bạn chưa tham gia khóa học nào.</li>
        )}
        {courses.map((course) => {
          const isOpen = openMenu === course._id;
          return (
            <li
              key={course._id}
              className="flex items-center bg-blue-50 border border-gray-200 rounded-2xl  hover:shadow-sm transition-all duration-300 relative overflow-hidden"
            >
              {/* Thumbnail */}
              {course.course.thumbnail ? (
                <img
                  src={course.course.thumbnail}
                  alt={course.course.title}
                  className="w-40 aspect-[5/4] object-cover rounded-l-2xl ml-3 rounded-2xl"
                />
              ) : (
                <div className="w-40 aspect-[5/4] bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center rounded-l-2xl text-gray-500 text-sm font-medium">
                  No Image
                </div>
              )}
              {/* Nội dung */}
              <div className="flex-1 p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                  {course.course.title}
                </h2>
                {course.course.instructor.role === "lecturer" ? (
                  <p className="text-sm text-gray-500 mb-1">
                    Giảng viên:{" "}
                    <span className="font-medium text-gray-700">
                      {course.course.instructor.fullName}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mb-1">
                    <span className="font-medium text-gray-700">
                      Bình dân số
                    </span>
                  </p>
                )}

                <p className="text-sm text-gray-500 mb-4">
                  Ngày tham gia:{" "}
                  <span className="font-medium text-gray-700">
                    {formatDate(course.createdAt)}
                  </span>
                </p>
                <Link
                  to={`${ROUTE_PATH.STUDENT_COURSE_DETAIL}`
                    .replace(":courseId", course.course._id)
                    .replace(
                      ":courseName",
                      course.course.title.replace(/\s+/g, "-").toLowerCase()
                    )}
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-sm font-medium rounded-xl  text-custom-blue border border-custom-blue shadow hover:bg-custom-hover-blue2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 cursor-pointer"
                >
                  Xem chi tiết
                </Link>
              </div>

              {/* Menu 3 chấm */}
              <div className="absolute top-4 right-4">
                <button
                  ref={isOpen ? buttonRef : null}
                  onClick={() => setOpenMenu(isOpen ? null : course._id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition duration-300 cursor-pointer"
                >
                  <SettingsIcon className="w-5 h-5 text-gray-500" />
                </button>

                {isOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden"
                  >
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                      onClick={() => {
                        setShowModalLeave(true);
                        setCourseToLeave(course);
                      }}
                    >
                      Rời khóa học
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {showModalLeave && (
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
              <h2 className="text-xl font-bold text-custom-blue mb-4">
                Rời khỏi khóa học
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn rời khỏi khóa học{" "}
                <span className="font-semibold text-custom-blue">
                  {courseToLeave?.course.title}
                </span>{" "}
                không?
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLeaveCourse();
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
                    Xác nhận
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

export default MyCoursePage;
