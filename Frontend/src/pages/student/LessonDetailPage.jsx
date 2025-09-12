import React, { useEffect, useState } from "react";

import LessonDetailCard from "../../components/LessonDetailCard";

import { Link, useParams } from "react-router-dom";

import { ROUTE_PATH } from "../../constants/routePath";

import lessonService from "../../services/lessonService";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

function handleClick(event) {
  event.preventDefault();
  console.info("Bạn vừa click vào breadcrumb.");
}

function LessonDetailPage() {
  const { lessonId } = useParams();
  const { courseId } = useParams();

  const [lesson, setLesson] = useState(null);

  const [getAllLessons, setGetAllLessons] = useState([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLesson(null); // reset trước khi load mới
        const response = await lessonService.getLessonById(lessonId);
        console.log("Fetched lesson:", response.data);

        setLesson(response.data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    const fetchAllLessons = async () => {
      try {
        const response = await lessonService.getLessonsByCourse(courseId);
        setGetAllLessons(response.data.filter((item) => item._id !== lessonId));
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLesson();
    fetchAllLessons();
  }, [lessonId, courseId]);

  if (!lesson) {
    return <div className="min-h-screen">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col md:flex-row px-4 md:px-10 py-6 gap-8 min-h-screen">
      {/* Nội dung bài học */}
      <div className="w-full md:w-3/4">
        <div role="presentation" onClick={handleClick} className="mb-4">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              padding: "8px 16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              "& .MuiLink-root": {
                color: "#1976d2",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              "& .MuiTypography-root": {
                color: "#333",
                fontWeight: 600,
              },
            }}
          >
            <Link underline="hover" to="/">
              Trang chủ
            </Link>
            <Link
              underline="hover"
              to={`${ROUTE_PATH.STUDENT_COURSE_DETAIL.replace(
                ":courseId",
                courseId
              ).replace(
                ":courseName",
                lesson?.course?.title.replace(/\s+/g, "-").toLowerCase()
              )}`}
            >
              Khóa học
            </Link>
            <Typography>Chi tiết bài học</Typography>
          </Breadcrumbs>
        </div>
        <LessonDetailCard lesson={lesson} />
      </div>

      {/* Các bài học khác */}
      <div className="w-full md:w-1/4 border-t md:border-t-0 md:border-l border-gray-300 pt-6 md:pt-0 md:pl-6">
        <h2 className="text-lg font-semibold text-custom-blue mb-4 text-center border-b border-gray-200 pb-2">
          Các bài học khác
        </h2>

        <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {getAllLessons.map((item) => (
            <li
              key={item._id}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
            >
              <Link
                to={ROUTE_PATH.STUDENT_LESSON_DETAIL.replace(
                  ":courseId",
                  courseId
                ).replace(":lessonId", item._id)}
                className="block p-3 hover:underline line-clamp-2"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LessonDetailPage;
