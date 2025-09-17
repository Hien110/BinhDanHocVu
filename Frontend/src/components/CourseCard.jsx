import React from "react";

import { ROUTE_PATH } from "../constants/routePath";
import { Link } from "react-router-dom";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";

function CourseCard({ course }) {
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
            <span className="font-medium text-gray-800">
              {course?.totalParticipants || 0} học viên
            </span>
          </div>
          <div className="flex justify-between items-center w-full">
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
                              hover:before:w-full"
            >
              <span className="relative z-10 text-sm">
                Xem chi tiết{" "}
                <ArrowForwardTwoToneIcon
                  fontSize="inherit"
                  className="inline-block pb-0.5"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
