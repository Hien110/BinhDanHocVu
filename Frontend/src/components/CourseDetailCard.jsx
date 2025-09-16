import React from "react";

import userService from "../services/userService";

function CourseDetailCard({ course }) {
  const currentUser = userService.getCurrentUser();

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-[320px_1fr] items-start">
      {/* Cột trái - Hình ảnh (cố định) */}
      <div className="flex-none rounded-2xl overflow-hidden shadow-lg md:w-[320px]">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full "
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-semibold">
            Không có ảnh đại diện
          </div>
        )}
      </div>

      {/* Cột phải - Thông tin (co giãn) */}
      <div className="min-w-0 flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-custom-blue leading-tight break-words">
            {course.title}
          </h1>

          {currentUser && currentUser.role !== "student" && (
            <span className="text-gray-500 break-words">
              Mã khóa học: {course.code}
            </span>
          )}
        </div>

        <div
          className="prose max-w-none text-gray-700 break-words"
          // nếu mô tả có các từ siêu dài, có thể mạnh tay hơn: add className "break-all"
          dangerouslySetInnerHTML={{
            __html: course.description || "<p>Không có mô tả</p>",
          }}
        />
      </div>
    </div>
  );
}

export default CourseDetailCard;
