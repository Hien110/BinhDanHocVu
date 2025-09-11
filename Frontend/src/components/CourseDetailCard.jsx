import React from "react";

import userService from "../services/userService";

function CourseDetailCard({ course }) {

  const currentUser = userService.getCurrentUser();

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-10 items-start">
      {/* Cột trái - Hình ảnh */}
      <div className="w-70 rounded-2xl overflow-hidden shadow-lg">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-70 object-cover"
          />
        ) : (
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 text-lg font-semibold">
            Không có ảnh đại diện
          </div>
        )}
      </div>

      {/* Cột phải - Thông tin */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-custom-blue">
            {course.title}
          </h1>

          {currentUser && currentUser.role !== "student" && (
            <span className="text-gray-500"> Mã khóa học: {course.code}</span>
          )}
        </div>
        <div
          className="prose prose-red max-w-full text-gray-700"
          dangerouslySetInnerHTML={{
            __html: course.description || "<p>Không có mô tả</p>",
          }}
        />
      </div>
    </div>
  );
}

export default CourseDetailCard;
