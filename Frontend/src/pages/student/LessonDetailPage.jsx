import React, { useEffect, useState } from "react";

import LessonDetailCard from "../../components/LessonDetailCard";

import { Link, useParams } from "react-router-dom";

import { ROUTE_PATH } from "../../constants/routePath";

import lessonService from "../../services/lessonService";

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
    <div className="w-full flex flex-col md:flex-row px-4 md:px-10 py-6 gap-8">
      {/* Nội dung bài học */}
      <div className="w-full md:w-3/4">
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
                className="block p-3 text-yellow-600 hover:text-yellow-700 hover:underline line-clamp-2"
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
