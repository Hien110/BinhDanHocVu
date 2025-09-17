import React, { useEffect, useMemo, useState } from "react";

import courseService from "../../services/courseService";
import { ROUTE_PATH } from "../../constants/routePath";

import { Link } from "react-router-dom";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";

function BinhDanSoPage() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getBinhDanSoCourses();
        // Backend đang trả { data: courses, message: ... }
        // => res.data.data là mảng courses
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setCourses(list);
      } catch (e) {
        console.error(e);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // chuẩn hóa chuỗi (bỏ dấu, lowercase) để tìm kiếm
  const normalize = (str = "") =>
    str
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // lọc theo tên khóa học (và giáo viên)
  const filteredCourses = useMemo(() => {
    const q = normalize(searchTerm);
    if (!q) return courses;
    return courses.filter((c) => {
      const byTitle = normalize(c?.title).includes(q);
      return byTitle;
    });
  }, [courses, searchTerm]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Ô tìm kiếm theo tên khóa học */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên khóa học "
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Khóa học Bình dân số
        </h2>

        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center text-gray-600 py-10">Đang tải…</div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center text-gray-600 py-10">
                Không tìm thấy khóa học phù hợp.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredCourses.map((course) => (
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
                            ? new Date(course.createdAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-row items-center text-sm">
                        <i className="fa-solid fa-eye text-gray-500 mr-1 w-4 h-4"></i>
                        <span className="font-medium text-gray-800">
                          {course?.totalParticipants || 0} học viên
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full">
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
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default BinhDanSoPage;
