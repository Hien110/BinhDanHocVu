import React, { useEffect, useState } from "react";

import courseService from "../../services/courseService";
import { ROUTE_PATH } from "../../constants/routePath";


import CourseCard from "../../components/CourseCard"; // Giả sử bạn có một component CourseCard để hiển thị thông tin khóa học

function ManageCoursesListPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await courseService.getCoursesByInstructor();
      if (result.success) {
          console.log(result.data);
        setCourses(result.data);
      } else {
        console.error(result.message);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
          Danh sách môn học
        </h1>

        {courses.length === 0 ? (
          <p className="text-gray-500 italic">Bạn chưa có khóa học nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-4 right-4 max-w-[250px] px-4 py-1 ">
        <button
          className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-custom-blue transition-colors duration-500 ease-in-out hover:bg-custom-hover-blue cursor-pointer shadow-md"
          onClick={() =>
            (window.location.href = ROUTE_PATH.LECTURER_CREATE_COURSE)
          }
        >
          <span className="text-lg mr-2">+</span>
          Tạo môn học mới
        </button>
      </div>
    </div>
  );
}

export default ManageCoursesListPage;
