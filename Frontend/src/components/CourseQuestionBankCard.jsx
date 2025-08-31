import React from "react";

import userService from "../services/userService";

import { ROUTE_PATH } from "../constants/routePath";
function CourseQuestionBankCard({ course }) {
  const user = userService.getCurrentUser();

  const handleDetail = (courseId) => {
    if (!user) {
      // Redirect to the login page if user is not logged in
      window.location.href = ROUTE_PATH.LOGIN;
      return;
    }
    if (user.role === "lecturer") {
      // Redirect to the course detail page
      window.location.href = `${ROUTE_PATH.LECTURER_QUESTION_BANK_DETAIL.replace(
        ":courseId",
        courseId
      )}`;
    } else if (user.role === "student") {
      window.location.href = `${ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
        ":courseId",
        courseId
      )}`;
    }
  };
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Thumbnail */}
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 p-4 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Không có ảnh
        </div>
      )}

      {/* Nội dung */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Wrapper nhóm tiêu đề và mô tả */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
            {course.title}
          </h2>
          <div className="text-sm text-gray-600 mb-4 line-clamp-3">
            <div dangerouslySetInnerHTML={{ __html: course.description }} />
          </div>
        </div>

        {/* Nút xem chi tiết đặt cuối container */}
        <button
          onClick={() => {
            handleDetail(course._id);
          }}
          className="cursor-pointer mt-auto w-full py-2 rounded-lg bg-white text-red-500 border border-red-500 font-medium text-sm shadow-md transition-colors duration-500 ease-in-out hover:bg-red-100"
        >
          Xem chi tiết ngân hàng câu hỏi
        </button>
      </div>
    </div>
  );
}

export default CourseQuestionBankCard;
