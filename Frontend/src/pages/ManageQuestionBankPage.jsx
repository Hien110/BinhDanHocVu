import React, { useEffect, useState } from "react";

import courseService from "../services/courseService";

import { ROUTE_PATH } from "../constants/routePath";

import CourseQuestionBankCard from "../components/CourseQuestionBankCard";

function ManageQuestionBankPage() {
  const [courseByInstructor, setCourseByInstructor] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await courseService.getCoursesByInstructor();
      if (res.success) {
        setCourseByInstructor(res.data);
      }
    };

    fetchCourses();
  }, []);


  if (!courseByInstructor) {
    return <p className="text-center min-h-screen">Loading...</p>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        Ngân hàng câu hỏi
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseByInstructor.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">
            Không có khóa học nào để tạo ngân hàng câu hỏi.
          </p>
        ) : (
          courseByInstructor.map((course) => (
            <CourseQuestionBankCard key={course._id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}

export default ManageQuestionBankPage;
